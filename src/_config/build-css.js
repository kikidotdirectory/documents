import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportExtGlob from 'postcss-import-ext-glob';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import fg from 'fast-glob';

const buildCss = async (inputPath, outputPaths) => {
  const inputContent = await fs.readFile(inputPath, 'utf-8');

  const result = await postcss([
    postcssImportExtGlob,
    postcssImport,
    tailwindcss,
    autoprefixer,
  ]).process(inputContent, {from: inputPath});

  for (const outputPath of outputPaths) {
    await fs.mkdir(path.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, result.css);
  }

  return result.css;
};

export const buildAllCss = async () => {
  const tasks = [];

  tasks.push(buildCss('src/css/global.css', ['src/_includes/css/global.css']));

  const localCssFiles = await fg(['src/css/local/**/*.css']);
  for (const inputPath of localCssFiles) {
    const baseName = path.basename(inputPath);
    tasks.push(buildCss(inputPath, [`src/_includes/css/${baseName}`]));
  }

  const componentCssFiles = await fg(['src/css/components/**/*.css']);
  for (const inputPath of componentCssFiles) {
    const baseName = path.basename(inputPath);
    tasks.push(buildCss(inputPath, [`dist/css/components/${baseName}`]));
  }

  await Promise.all(tasks);
};

