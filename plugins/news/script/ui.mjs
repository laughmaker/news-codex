import { readFile } from 'node:fs/promises';
export async function readUi() {
 const [html,marked,purify]=await Promise.all([
  readFile(new URL('../public/reader.html',import.meta.url),'utf8'),
  readFile(new URL('../assets/vendor/marked.umd.js',import.meta.url),'utf8'),
  readFile(new URL('../assets/vendor/purify.min.js',import.meta.url),'utf8')
 ]);
 return html.replace('<!-- markdown-renderer -->',`<script>${marked.replace(/<\/script/gi,'<\\/script')}</script><script>${purify.replace(/<\/script/gi,'<\\/script')}</script>`);
}
