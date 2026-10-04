import {readUi} from './ui.mjs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { readNews, getNews } from './data.mjs';
const logo=await readFile(new URL('../assets/sidebar-icon.svg',import.meta.url));
const icons=[{src:'data:image/svg+xml;base64,'+logo.toString('base64'),mimeType:'image/svg+xml',sizes:['any']}];
const server = new McpServer({name:'news',version:'0.2.2',icons});
const uri='ui://news/reader';
const result = data => ({content:[{type:'text',text:JSON.stringify(data)}],structuredContent:data});
const annotations={readOnlyHint:true,destructiveHint:false,openWorldHint:false};
server.registerResource('news-reader',uri,{mimeType:'text/html;profile=mcp-app'},async()=>({contents:[{uri,mimeType:'text/html;profile=mcp-app',text:await readUi() }]}));
server.registerTool('open_news',{title:'News',description:'Open the local news archive reader.',inputSchema:{},annotations,_meta:{ui:{resourceUri:uri},'openai/ui':{entrypoints:[{type:'global'},{type:'thread'}]}}},async()=>result({news:await readNews()}));
server.registerTool('list_news',{description:'List archived news editions. Content dates are historical, not current claims.',inputSchema:{},annotations},async()=>result({news:await readNews()}));
server.registerTool('get_news',{description:'Read one archived edition with original source links.',inputSchema:{id:z.string()},annotations},async({id})=>result({news:[await getNews(id)]}));
server.registerTool('search_news',{description:'Search titles and full text of the local news archive.',inputSchema:{query:z.string().max(500)},annotations},async({query})=>result({news:await readNews(query)}));
// SDK 1.32 registerTool omits standard icons. Decorate its serialized tools/list
// response until the high-level registration API supports that field.
const transport=new StdioServerTransport();
const send=transport.send.bind(transport);
transport.send=(message,options)=>{
 if(Array.isArray(message.result?.tools))message={...message,result:{...message.result,tools:message.result.tools.map(tool=>tool.name==='open_news'?{...tool,icons}:tool)}};
 return send(message,options);
};
await server.connect(transport);
