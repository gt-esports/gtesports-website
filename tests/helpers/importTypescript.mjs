import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const compiled = new Map();

export async function importTypescript(url) {
  async function moduleUrl(sourceUrl) {
    if (compiled.has(sourceUrl.href)) return compiled.get(sourceUrl.href);
    const source = await readFile(sourceUrl, 'utf8');
    let { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    });
    for (const match of [...outputText.matchAll(/from ['"]([^'"]+)['"]/g)]) {
      if (!match[1].startsWith('.')) throw new Error(`Unexpected external import: ${match[1]}`);
      const dependency = await moduleUrl(new URL(`${match[1]}.ts`, sourceUrl));
      outputText = outputText.replace(match[0], `from '${dependency}'`);
    }
    const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
    compiled.set(sourceUrl.href, dataUrl);
    return dataUrl;
  }
  return import(await moduleUrl(url));
}
