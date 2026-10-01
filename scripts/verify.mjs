import {spawnSync} from 'node:child_process';
const commands = [
 [process.execPath, ['scripts/check-benchmark.mjs']],
 [process.execPath, ['--test', 'scripts/check-benchmark.test.mjs']],
 [process.execPath, ['tests/native-docs.mjs']],
 [process.execPath, ['tests/docs.mjs']],
 [process.execPath, ['tests/examples.mjs']],
 ['npm', ['run', 'build:local']],
 ['npm', ['run', 'typecheck']],
 [process.execPath, ['tests/content.mjs']],
 [process.execPath, ['tests/http.mjs']],
];
for(const [command,args] of commands) {
 const result=spawnSync(command,args,{stdio:'inherit',timeout:240000});
 if(result.status!==0)process.exit(result.status??1);
}
