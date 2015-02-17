# Static site generator using Gulp

This is a simple static site generator which is perfect for a personal, project or blog site.

It is similar to other static site generators in that it takes your Markdown content, renders it, optimises it and creates a production-ready site that can be served by Nginx, Apache or another web server.

##Installation

This project is ideal when used as a Git sub-module or installed along-side your site so you can update it when new releases are made.

###Getting the generator

####Git sub-module

    $ mkdir my-static-site
    $ cd my-static-site
    $ git submodule add git@github.com:ducksoupdev/gulp-site-generator.git tools

####Straightforward checkout

    $ mkdir my-static-site
    $ cd my-static-site
    $ git clone git@github.com:ducksoupdev/gulp-site-generator.git tools

###Installing the dependencies

Before using the generator, three dependent files are needed in the root of your site:

* `package.json` - the node modules required by the generator
* `gulpfile.js` - the gulp file for all the generator tasks
* `site.json` - the meta data for your site

Installing the dependent files is done with the install script:

    $ node tools/install

Once copied, the next thing is to install the required node modules:

    $ npm install

##Creating content

Once you have installed the generator, you need to add some content.

The generator is opinionated in that it expects certain files in particular directories.
To help with this, [an example site](https://github.com/ducksoupdev/gulp-site-generator-example) is available that shows you how to structure your site with the generator.

