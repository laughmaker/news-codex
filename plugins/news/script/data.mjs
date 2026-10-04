import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
let config={};
try{config=JSON.parse(await readFile(path.join(os.homedir(),'.config/news-codex/config.json'),'utf8'))}catch(error){if(error.code!=='ENOENT')throw new Error('Invalid News configuration: '+error.message)}
const samples=fileURLToPath(new URL('../samples/',import.meta.url));
export const root = process.env.NEWS_DIR || config.newsDir || samples;
if(typeof root!=='string'||!path.isAbsolute(root))throw new Error('News folder must be an absolute path. Set newsDir in ~/.config/news-codex/config.json.');
export function fileDate(name) {
 const m = name.match(/^(\d{4})-?(\d{2})-?(\d{2})(?=[-_.])/);
 return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
export async function readNews(query = '') {
 const files = (await readdir(root)).filter(n => n.endsWith('.md') && fileDate(n));
 const news = await Promise.all(files.map(async id => {
  const markdown = await readFile(path.join(root,id),'utf8');
  return {id,date:fileDate(id),title:markdown.match(/^#\s+(.+)$/m)?.[1]||id,markdown,
   sources:[...new Set(markdown.match(/https?:\/\/[^\s)<>]+/g)||[])]};
 }));
 return news.sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).filter(n => !query || (n.title+'\n'+n.markdown).toLowerCase().includes(query.toLowerCase()));
}
export async function getNews(id) {
 const item = (await readNews()).find(n=>n.id===id);
 if(!item) throw new Error('News item not found');
 return item;
}
