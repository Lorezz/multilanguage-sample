#!/usr/bin/env zx

//CONST
const labels = require('./translations.json');
const { translations, defaultLocale, languages } = labels;
const langs = languages.filter((l) => l != defaultLocale);
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
      console.log('put here your custom page query for the current locale:', locale);
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
console.log(chalk.blue('Hello routes generator!'));
let lang = await question(
  `What language do you want generate? ${langs.join('|')} : `
);
if (!langs.includes(lang)) {
  console.log(chalk.red('Language not found!'));
  process.exit(1);
}
// let content = JSON.parse(await stdin());
// let name = 'dist';
// await $`mkdir ${name}`;

//MOVE TO PAGES DIRECTORY
await cd(`pages`);
const pwd = await $`pwd`;
await $`echo Current folder is ${pwd}.`;

//GET ROUTE FOLDERS on root
console.log(chalk.blue('list page root folder...'));
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

//ERASE PREVIOUS SUB FOLDER

within(async () => {
  console.log(chalk.blue('Removing previous ' + lang + ' folder...'));
  try {
    await $`rm -fr ${lang}`;
  } catch (error) {
    console.log(error);
  }

  try {
    //CREATE LANG FOLDER
    console.log(chalk.blue('Generating new ' + lang + ' folder...'));
    await $`mkdir ${lang}`;

    //CREATE TRANSLATED FOLDERS
    console.log(chalk.blue('Creating translated folders...'));
    const folderPromises = rootFolders.map((folder) => {
      return $`mkdir -p ${lang}/${getTranslation(folder, lang)}`;
    });
    await Promise.all(folderPromises);

    //COPY FILES
    console.log(chalk.blue('Generating page files...'));
    const generateFiles = files.map((file) => {
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
      // await $`touch ${dest}`;

      //WRITE
      // await fs.copy(source, dest);
      const str = getTemplate(
        source,
        lang,
        filePath.join('-').replace('.js', '')
      );
      return fs.writeFile(dest, str);
    });
    await Promise.all(generateFiles);
  } catch (error) {
    console.log(error);
  }
  console.log(chalk.blue('Done!'));
});
