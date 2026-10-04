import assert from 'node:assert/strict';
import {readNews,fileDate} from './data.mjs';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
const client=new Client({name:'news-check',version:'1.0.0'});
try {
await client.connect(new StdioClientTransport({command:process.execPath,env:{...process.env},args:[process.env.NEWS_SERVER_PATH||new URL('../dist/server.mjs',import.meta.url).pathname]}));
const tools=(await client.listTools()).tools;
assert.equal(tools.length,4);const icon=tools.find(t=>t.name==='open_news').icons?.[0];assert.equal(icon?.mimeType,'image/svg+xml');assert.equal(Buffer.from(icon.src.split(',')[1],'base64').toString(),await (await import('node:fs/promises')).readFile(new URL('../assets/sidebar-icon.svg',import.meta.url),'utf8'));assert.equal(tools.find(t=>t.name==='open_news')._meta['openai/ui'].entrypoints[0].type,'global');
const all=await client.callTool({name:'list_news',arguments:{}});assert.equal(all.structuredContent.news.length,(await readNews()).length);assert(all.structuredContent.news.length>0);assert.equal(all.structuredContent.news[0].date,(await readNews())[0].date);assert.equal(fileDate('20261003-hn-ai-top5.md'),'2026-10-03');assert.equal(fileDate('2026-09-14-github.md'),'2026-09-14');
for(const n of all.structuredContent.news){assert(n.sources.length>0);const r=await client.callTool({name:'get_news',arguments:{id:n.id}});assert.equal(r.structuredContent.news[0].markdown,n.markdown)}
assert((await client.callTool({name:'search_news',arguments:{query:all.structuredContent.news[0].title}})).structuredContent.news.length>=1);
assert((await client.callTool({name:'search_news',arguments:{query:'does-not-exist-20261004'}})).structuredContent.news.length===0);
assert((await client.callTool({name:'get_news',arguments:{id:'../../etc/passwd'}})).isError);
const resource=await client.readResource({uri:'ui://news/reader'});assert(resource.contents[0].text.includes('ui/initialize'));
console.log('PASS: MCP connection, 4 tools, complete archive and both filename date formats, search, invalid ID rejection, sidebar metadata and UI resource.');
} finally {await client.close()}
