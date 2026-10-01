import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
const root=resolve('.verification/displayed-examples');
await rm(root,{recursive:true,force:true});await mkdir(root,{recursive:true});
const files=[];
for(const filename of ['src/components/Examples.tsx']){
 const source=ts.createSourceFile(filename,await readFile(filename,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const examples=[];
 const visit=node=>{
  if(ts.isObjectLiteralExpression(node)){
   const props=new Map(node.properties.filter(ts.isPropertyAssignment).map(p=>[p.name.getText(source),p.initializer]));
   const code=props.get('codeSnippet')??props.get('code');
   if(code&&ts.isNoSubstitutionTemplateLiteral(code)&&props.get('language')?.text!=='rust'){
    const path=props.get('filename')?.text??`api/${props.get('id')?.text}.ts`;
    examples.push({path,code:code.text});
   }
  }
  ts.forEachChild(node,visit);
 };
 visit(source);
 for(const example of examples){const file=resolve(root,example.path);assert.ok(file.startsWith(root+'/'));await mkdir(dirname(file),{recursive:true});await writeFile(file,example.code+'\nexport {};\n');files.push(file);}
}
assert.equal(files.length,7,'Every API TypeScript example must be checked');
await writeFile(resolve(root,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',lib:['ES2022','DOM','DOM.Iterable'],strict:true,noEmit:true,skipLibCheck:true,types:['node','react','react-dom']},files:[...files,resolve('.verification/native-fact-fixture/.zap/types/native.d.ts')]},null,2));
const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--project',resolve(root,'tsconfig.json')],{encoding:'utf8',timeout:60000});
assert.equal(result.status,0,result.stdout+result.stderr||String(result.error));
console.log(JSON.stringify({status:'passed',compiledApiExamples:files.length}));
