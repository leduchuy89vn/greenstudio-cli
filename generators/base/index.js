const writePkg = require('write-pkg');
const readPkg = require('read-pkg');
const deepExtend = require('deep-extend');
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // name of the app based on the directory name generated by React Native
    this.name = this.appname;
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'flowVerison',
        message: 'Which version of Flow should be used? (should match verison in .flowconfig)',
      },
      {
        type: 'confirm',
        name: 'createGit',
        message: 'Create a local git repo?',
        default: true,
      },
    ]).then((answers) => {
      this.nodeVersion = answers.nodeVersion;
      this.createGit = answers.createGit;
      this.flowVerison = answers.flowVerison;
    });
  }

  writing() {
    if (this.createGit) {
      this.composeWith(require.resolve('generator-git-init'));
    }

    // create entry points for Android and iOS
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath('index.js'),
      { name: this.name }
    );

    // remove App.js generated by RN
    this.fs.delete('App.js');

    // copy root app file that the entry points use
    this.fs.copyTpl(
      this.templatePath('App/App.js'),
      this.destinationPath(`App/${this.name}.js`),
      { name: this.name }
    );

    // copy router
    this.fs.copyTpl(
      this.templatePath('App/Router.js'),
      this.destinationPath('App/Router.js'),
      { name: this.name }
    );

    // copy scenes
    this.fs.copyTpl(
      this.templatePath('App/Scenes'),
      this.destinationPath('App/Scenes'),
      {
        name: this.name,
      }
    );

    // copy components
    this.fs.copyTpl(
      this.templatePath('App/Components'),
      this.destinationPath('App/Components'),
      { name: this.name }
    );

    // copy store
    this.fs.copyTpl(
      this.templatePath('App/Store/index.js'),
      this.destinationPath('App/Store/index.js'),
      { name: this.name }
    );

    // copy store middleware
    this.fs.copyTpl(
      this.templatePath('App/Store/Middleware/Buffer.js'),
      this.destinationPath('App/Store/Middleware/Buffer.js'),
      { name: this.name }
    );

    this.fs.copyTpl(
      this.templatePath('App/Store/Middleware/index.js'),
      this.destinationPath('App/Store/Middleware/index.js'),
      { name: this.name }
    );

    this.fs.copyTpl(
      this.templatePath('App/Store/Middleware/Saga.js'),
      this.destinationPath('App/Store/Middleware/Saga.js'),
      { name: this.name }
    );

    this.fs.copyTpl(
      this.templatePath('App/Store/Middleware/Logger.js'),
      this.destinationPath('App/Store/Middleware/Logger.js'),
      { name: this.name }
    );

    // copy reducers
    this.fs.copyTpl(
      this.templatePath('App/Reducers/App.js'),
      this.destinationPath('App/Reducers/App.js'),
      { name: this.name }
    );

    this.fs.copyTpl(
      this.templatePath('App/Reducers/index.js'),
      this.destinationPath('App/Reducers/index.js'),
      {
        name: this.name,
        reducers: ['App'],
      }
    );

    // copy actions
    this.fs.copyTpl(
      this.templatePath('App/Actions'),
      this.destinationPath('App/Actions'),
      { name: this.name }
    );

    // copy language
    this.fs.copyTpl(
      this.templatePath('App/Language'),
      this.destinationPath('App/Language'),
      { name: this.name }
    );

    // copy sagas
    this.fs.copyTpl(
      this.templatePath('App/Sagas'),
      this.destinationPath('App/Sagas'),
      { name: this.name }
    );

    // copy services
    this.fs.copyTpl(
      this.templatePath('App/Services'),
      this.destinationPath('App/Services'),
      { name: this.name }
    );

    // copy helpers
    this.fs.copyTpl(
      this.templatePath('App/Helpers'),
      this.destinationPath('App/Helpers'),
      { name: this.name }
    );

    // copy styles
    this.fs.copyTpl(
      this.templatePath('App/Styles'),
      this.destinationPath('App/Styles'),
      { name: this.name }
    );

    // copy config
    this.fs.copyTpl(
      this.templatePath('App/Config'),
      this.destinationPath('App/Config'),
      { name: this.name }
    );

    // copy default .env
    this.fs.copyTpl(
      this.templatePath('.env'),
      this.destinationPath('.env'),
      {
        env: 'development',
        api_url: 'http://localhost:3000',
        storage_prefix: 'development',
      }
    );
    this.fs.copyTpl(
      this.templatePath('.env'),
      this.destinationPath('.env.staging'),
      {
        env: 'staging',
        api_url: 'http://localhost:3000',
        storage_prefix: 'staging',
      }
    );
    this.fs.copyTpl(
      this.templatePath('.env'),
      this.destinationPath('.env.production'),
      {
        env: 'production',
        api_url: 'http://localhost:3000',
        storage_prefix: 'production',
      }
    );

    this.fs.copy(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    );

    this.fs.copy(
      this.templatePath('App/Assets'),
      this.destinationPath('App/Assets')
    );

    this.fs.copy(
      this.templatePath('App/Types'),
      this.destinationPath('App/Types')
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { name: this.name, nameLower: this.name.toLowerCase() }
    );

    //  copy shell scripts
    this.fs.copyTpl(
      this.templatePath('bin'),
      this.destinationPath('bin'),
      { name: this.name }
    );

    // merge the two package json files
    const templatePackage = readPkg.sync(this.templatePath('package.json'));
    const currentPackage = readPkg.sync();
    writePkg.sync(deepExtend(templatePackage, currentPackage));
  }

  install() {
    this.yarnInstall([
      'axios',
      'react-native-config',
      'react-navigation@1.5.11',
      'react-redux',
      'redux',
      'redux-action-buffer',
      'redux-logger',
      'redux-persist',
      'redux-saga',
      'styled-components',
    ]);

    this.yarnInstall([
      'flow-bin@' + this.flowVerison,
      'eslint',
      'babel-eslint',
      'prettier',
      'husky',
      'lint-staged',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'eslint-config-xo',
      'eslint-plugin-react',
      'eslint-plugin-react-native',
      'eslint-plugin-flowtype',
      'jest',
      'https://github.com/simpleweb/configs.git#0.0.2',
    ], {
      'dev': true
    });
  }

  end() {
    this.spawnCommandSync('yarn', ['run', 'pretty']);
    this.spawnCommandSync('yarn', ['run', 'updateignore']);
    this.spawnCommandSync('react-native', ['link', 'react-native-config']);
    this.spawnCommandSync('yarn', ['run', 'react-native-config']);
    this.log('Creating iOS Schemes', this.name);
    this.spawnCommandSync('python', ['./bin/create-schemes.py', this.name]);
    this.log('Setup complete!');
    this.log('Please refer to the post-install notes');
    this.log('https://github.com/simpleweb/generator-react-native#after-react-nativebase');
  }
};
