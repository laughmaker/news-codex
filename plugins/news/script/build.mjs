import {build} from 'esbuild';
import {mkdir,copyFile,readdir,readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
await mkdir(new URL('assets/vendor/',root),{recursive:true});
await build({entryPoints:[new URL('script/server.mjs',root).pathname],outfile:new URL('dist/server.mjs',root).pathname,bundle:true,platform:'node',format:'esm',target:'node22',banner:{js:"import {createRequire as __createRequire} from 'node:module';const require=__createRequire(import.meta.url);"}});
for(const [source,target] of [['marked/lib/marked.umd.js','marked.umd.js'],['dompurify/dist/purify.min.js','purify.min.js'],['marked/LICENSE','marked-LICENSE.md'],['dompurify/LICENSE','dompurify-LICENSE'],['dompurify/LICENSE-MPL','dompurify-LICENSE-MPL']])await copyFile(new URL('node_modules/'+source,root),new URL('assets/vendor/'+target,root));
console.log('Built standalone MCP server and browser renderer assets.');

const notices=[];
async function collect(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const url=new URL(entry.name+(entry.isDirectory()?'/':''),directory);if(entry.isDirectory())await collect(url);else if(/^(licen[cs]e|copying|notice)([.-]|$)/i.test(entry.name))notices.push(url.pathname.split('/node_modules/')[1]+'\n'+await readFile(url,'utf8'))}}
await collect(new URL('node_modules/',root));
await writeFile(new URL('dist/THIRD_PARTY_NOTICES.txt',root),notices.join('\n\n--------------------\n\n'));
