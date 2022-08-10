#!/usr/bin/env zx
// import 'zx/globals';
const langs = ['it', 'en', 'fr', 'de', 'es', 'pt', 'ru', 'ja', 'zh'];
const exclude = ['_app.js', 'api'];

console.log(chalk.blue('Hello world!'));
let lang = await question(
  `What language do you want generate? ${langs.join('|')} : `
);
// let content = JSON.parse(await stdin());
// let name = 'dist';
// await $`mkdir ${name}`;

await cd(`pages`);
const ls = await $`ls`;
const rootFolders = ls.stdout
  .split('\n')
  .filter(Boolean)
  .filter((s) => ![...langs, ...exclude].includes(s))
  .filter((s) => !s.includes('.js'));
console.log('rootFolders', rootFolders);

let allfiles = await glob(['**/*.js', '!_app.js', '!api/*']);
const files = allfiles.filter(
  (p) => !p.split('/')[0] || !langs.includes(p.split('/')[0])
);
console.log('files to copy', files);

try {
  await $`mkdir ${lang}`;
} catch (error) {
  console.log(lang, 'alredy exists');
}

try {
  rootFolders.forEach(async (folder) => {
    await $`mkdir ${lang}/${folder}`;
  });
} catch (error) {
  console.log(error);
}

try {
  files.forEach(async (file) => {
    // const filename = file.split('/')[1];
    const source = `${file}`;
    const dest = `${lang}/${file}`;
    await fs.copy(source, dest);
  });
} catch (error) {
  console.log(error);
}
