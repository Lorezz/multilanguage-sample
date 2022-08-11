#!/usr/bin/env zx

//CONST
const labels = require('./translations.json');
const { translations, defaultLocale } = labels;
const langs = ['it', 'en', 'fr', 'de', 'es', 'pt', 'ru', 'ja', 'zh'].filter(
  (l) => l != defaultLocale
);
const exclude = ['_app.js', 'api'];
//UTILS
function getTranslation(filename, lang) {
  const hasExtension = filename.indexOf('.') > -1;
  const ext = hasExtension ? filename.split('.')[1] : null;
  const name = hasExtension ? filename.split('.')[0] : filename;
  const translation = translations[name] ? translations[name][lang] : name;
  if (hasExtension) {
    return translation + '.' + ext;
  }
  return translation;
}
function getTemplate(source, lang, title) {
  return `
    import { default as alias } from 'pages/${source}';
    export default alias;

    export async function getStaticProps({ params, locale = '${lang}' }) {
      console.log('getStaticProps', locale);
      return {
        props: {
          locale,
          title: '${title}',
        },
      };
    }
`;
}

//START
console.log(chalk.blue('Hello world!'));
let lang = await question(
  `What language do you want generate? ${langs.join('|')} : `
);
// let content = JSON.parse(await stdin());
// let name = 'dist';
// await $`mkdir ${name}`;

await cd(`pages`);
let pwd = await $`pwd`;
await $`echo Current folder is ${pwd}.`;

//GET ROUTE FOLDERS on root
const ls = await $`ls`;
const rootFolders = ls.stdout
  .split('\n')
  .filter(Boolean)
  .filter((s) => ![...langs, ...exclude].includes(s))
  .filter((s) => !s.includes('.js'));
console.log('rootFolders', rootFolders);

//GET ROUTE FILES of root
let allfiles = await glob(['**/*.js', '!_app.js', '!api/*']);
const files = allfiles.filter(
  (p) => !p.split('/')[0] || !langs.includes(p.split('/')[0])
);
console.log('files to copy', files);

//CREATE LANG FOLDER
within(async () => {
  try {
    return await $`mkdir ${lang}`;
  } catch (error) {
    console.log(lang, 'alredy exists');
  }
});

//CREATE TRANSLATED FOLDERS
within(async () => {
  try {
    return rootFolders.forEach(async (folder) => {
      await $`mkdir -p ${lang}/${getTranslation(folder, lang)}`;
    });
  } catch (error) {
    console.log(error);
  }
});

//COPY FILES
within(async () => {
  try {
    return files.forEach(async (file) => {
      //TRANSLATE PATH
      const filePath = file
        .split('/')
        .map((name) => getTranslation(name, lang));
      console.log('filePath', filePath);

      //GET SOURCE FILE
      const source = `${file}`;
      console.log('source', source);

      //GET DEST FILE
      const dest = `${lang}/${filePath.join('/')}`;
      console.log('dest', dest);
      await $`touch ${dest}`;

      //WRITE
      // await fs.copy(source, dest);
      const str = getTemplate(
        source,
        lang,
        filePath.join('-').replace('.js', '')
      );
      await fs.writeFile(dest, str);
    });
  } catch (error) {
    console.log(error);
  }
});
