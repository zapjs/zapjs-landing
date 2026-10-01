import {mkdir,readFile,writeFile,copyFile,symlink} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {buildNative} from '../node_modules/@zap-js/client/dist/native/build.js';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
process.chdir(fileURLToPath(new URL('..', import.meta.url)));

function objectWithId(source, id) {
  const file=ts.createSourceFile('example.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  let found;
  function visit(node) {
    if(ts.isObjectLiteralExpression(node) && node.properties.some(property =>
      ts.isPropertyAssignment(property) && property.name.getText(file)==='id' &&
      ts.isStringLiteral(property.initializer) && property.initializer.text===id)) found=node;
    ts.forEachChild(node,visit);
  }
  visit(file);
  assert.ok(found, `Missing example ${id}`);
  return found;
}
function property(object,name) {
  const match=object.properties.find(item => ts.isPropertyAssignment(item) && item.name.getText()===name);
  assert.ok(match, `Missing property ${name}`);
  return match.initializer;
}
function literal(node) {
  assert.ok(ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node), 'Example must be a literal code string');
  return node.text;
}
const root=resolve('.verification/native-fact-fixture');
await mkdir(join(root,'native/src'),{recursive:true});
try { await symlink(resolve('node_modules'),join(root,'node_modules'),'dir'); } catch(e) { if(e.code!=='EEXIST')throw e; }
for(const file of ['Cargo.toml','Cargo.lock','build.rs'])await copyFile(join('native',file),join(root,'native',file));
await copyFile('rust-toolchain.toml',join(root,'rust-toolchain.toml'));
await writeFile(join(root,'package.json'),JSON.stringify({name:'native-fact-check',version:'1.0.0',type:'module',napi:{name:'native-fact-check'}}));
const docs=await readFile('src/content/docs.ts','utf8');
const blocks=property(objectWithId(docs,'native'),'blocks');
assert.ok(ts.isArrayLiteralExpression(blocks));
const snippets=blocks.elements.filter(node => ts.isCallExpression(node) && node.expression.getText()==='code' && node.arguments[1] && literal(node.arguments[1])==='rust').map(node=>literal(node.arguments[0]));
assert.equal(snippets.length,2,'Expected greeting and checksum Rust documentation blocks');
const demo=await readFile('src/components/CodeDemo.tsx','utf8');
const rust=literal(property(objectWithId(demo,'rust'),'code'));
await writeFile(join(root,'native/src/lib.rs'),[rust,...snippets].join('\n\n'));
const artifact=await buildNative(root,{release:true});
const {greeting,checksum,sumNumbers}=await import(artifact.loaderPath);
assert.equal(greeting('Ada'),'Hello, Ada');
assert.throws(()=>greeting(42));
assert.equal(await checksum([0,1,255]),256);
assert.equal(await checksum([]),0);
for(const input of [[-1],[256],[0.5],[NaN],[Infinity],['1']])await assert.rejects(async()=>checksum(input));
assert.equal(await sumNumbers([20,22]),42);
assert.equal(await sumNumbers([0xffffffff]),0xffffffff);
assert.equal(await sumNumbers([]),0);
for(const input of [[-1],[0xffffffff+1],[0.5],[NaN],[Infinity],['1'],[0xffffffff,1]])await assert.rejects(async()=>sumNumbers(input));
const declarations=await readFile(artifact.bindingsPath,'utf8');
assert.match(declarations,/function greeting\(name: string\): string/);
assert.match(declarations,/function checksum\(values: Array<number>\): Promise<number>/);
assert.match(declarations,/function sumNumbers\(values: Array<number>\): Promise<number>/);
await writeFile('.verification/native-facts.json',JSON.stringify({pass:true,target:artifact.target,exports:artifact.exports,declarations,checks:['exact docs+demo Rust snippets release build','sync greeting runtime and strict conversion','async checksum valid/invalid/runtime strict conversion','async sumNumbers valid/overflow/domain/runtime strict conversion','actual generated declarations match docs']},null,2));
console.log(await readFile('.verification/native-facts.json','utf8'));
