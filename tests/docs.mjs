import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, mkdir, writeFile, rm, access } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import ts from 'typescript';

// Compile the displayed examples themselves, retaining their documented paths so
// cross-file imports (notably useActionState -> server action) are checked too.
const root = resolve(import.meta.dirname, '..');
const fixture = resolve(root, '.verification/docs-typecheck');
await rm(fixture, { recursive: true, force: true });
await mkdir(fixture, { recursive: true });
const source = await readFile(resolve(root, 'src/content/docs.ts'), 'utf8');
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { documentation } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);
const nativeDeclarations = resolve(root, '.verification/native-fact-fixture/.zap/types/native.d.ts');
try { await access(nativeDeclarations); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  throw new Error('Native example declarations are missing. Run node tests/native-docs.mjs first.');
}
const examples = [];
for (const section of documentation) {
  for (const [index, block] of section.blocks.entries()) {
    if (block.type !== 'code' || block.language !== 'typescript') continue;
    assert.ok(block.filename, `A TypeScript example needs its displayed file path: ${section.id}:${index}`);
    const file = resolve(fixture, section.id, block.filename);
    assert.ok(file.startsWith(fixture + '/'), 'Example path must remain inside the fixture');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, block.code);
    examples.push(relative(fixture, file));
  }
}
// Extract static code strings through the TypeScript parser, without evaluating
// the component or importing its browser dependencies.
const demoSource = await readFile(resolve(root, 'src/components/CodeDemo.tsx'), 'utf8');
const demoAst = ts.createSourceFile('CodeDemo.tsx', demoSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let codeExamples;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(demoAst) === 'codeExamples') codeExamples = node.initializer;
  ts.forEachChild(node, visit);
}
visit(demoAst);
assert.ok(codeExamples && ts.isArrayLiteralExpression(codeExamples), 'Code demo examples must be statically inspectable');
for (const node of codeExamples.elements) {
  assert.ok(ts.isObjectLiteralExpression(node));
  const values = Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(property => [property.name.getText(demoAst), property.initializer]));
  if (values.language?.text !== 'typescript') continue;
  assert.ok(values.filename && ts.isStringLiteral(values.filename));
  assert.ok(values.code && ts.isNoSubstitutionTemplateLiteral(values.code));
  const file = resolve(fixture, 'code-demo', values.filename.text);
  assert.ok(file.startsWith(fixture + '/'));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, values.code.text);
  examples.push(relative(fixture, file));
}
await writeFile(resolve(fixture, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', lib: ['ES2022', 'DOM', 'DOM.Iterable'], strict: true, noEmit: true, skipLibCheck: true, types: ['node', 'react', 'react-dom'] },
  include: [...examples, nativeDeclarations],
}, null, 2));
const compiler = resolve(root, 'node_modules/typescript/bin/tsc');
const result = spawnSync(process.execPath, [compiler, '--project', resolve(fixture, 'tsconfig.json')], { encoding: 'utf8', timeout: 60000 });
if (result.status !== 0) throw new Error(result.stdout + result.stderr || String(result.error));

// Verify documented request-local equality, copy and isolation semantics against
// the installed package, rather than a reimplementation of the examples.
const { handleRequest, headers, cookies, memoize, cache } = await import('@zap-js/client/server');
let loads = 0;
const memo = memoize(async value => ({ value, invocation: ++loads }));
const req = (language) => new Request('https://docs.example/test', { headers: { 'accept-language': language } });
await handleRequest(req('en'), async () => {
  assert.equal(await memo(0), await memo(0));
  assert.notEqual(await memo(0), await memo(-0));
  assert.notEqual(await memo(null), await memo(undefined));
  const a = {}, b = {};
  assert.equal(await memo(a), await memo(a));
  assert.notEqual(await memo(a), await memo(b));
  const copy = headers(); copy.set('accept-language', 'changed');
  assert.equal(headers().get('accept-language'), 'en');
  assert.throws(() => cookies().set('theme', 'dark'), /only be modified/);
  return new Response(null);
}, { mode: 'render' });
const firstRequestLoads = loads;
await handleRequest(req('fr'), async () => { await memo(0); return new Response(null); }, { mode: 'render' });
assert.equal(loads, firstRequestLoads + 1);
await handleRequest(req('en'), async () => {
  assert.throws(() => headers(), /prerendering/);
  return new Response(null);
}, { mode: 'render', prerender: true });
const shared = cache(async () => headers().get('accept-language'), { key: () => 'language', ttl: 60 });
await handleRequest(req('en'), async () => {
  await assert.rejects(shared(), /configured CacheStore/);
  return new Response(null);
}, { mode: 'render' });

console.log(JSON.stringify({ passed: true, compiledExamples: examples.length, examples, runtimeChecks: ['argument identity and signed zero', 'request-local isolation', 'headers returns copy', 'render cookie mutation rejected', 'prerender metadata rejected', 'shared cache has no implicit backend'] }, null, 2));
