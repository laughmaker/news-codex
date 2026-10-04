import {readUi} from './ui.mjs';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {readNews} from './data.mjs';
const host='127.0.0.1';
http.createServer(async(req,res)=>{try{req.url=req.url.split('?')[0];if(req.url==='/api/news'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify({structuredContent:{news:await readNews()}}))}else if(['/design/','/design/index.html','/design/direction-a.html','/design/direction-b.html','/design/direction-c.html','/design/timelines.html','/design/timeline-a.html','/design/timeline-b.html','/design/timeline-c.html'].includes(req.url)){res.setHeader('Content-Type','text/html; charset=utf-8');const file=req.url==='/design/'?'index.html':req.url.split('/').pop();res.end(await readFile(new URL('../../../design/'+file,import.meta.url)))}else if(req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readUi())}else{res.writeHead(404);res.end()}}catch{res.writeHead(500);res.end('Unable to read archive')}}).listen(43128,host,()=>console.log('News preview: http://127.0.0.1:43128'));
