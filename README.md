# Static site generator using Gulp

[![Build Status](https://travis-ci.org/ducksoupdev/gulp-site-generator.svg?branch=master)](https://travis-ci.org/ducksoupdev/gulp-site-generator)
[![Coverage Status](https://coveralls.io/repos/ducksoupdev/gulp-site-generator/badge.svg?branch=master)](https://coveralls.io/r/ducksoupdev/gulp-site-generator?branch=master)

This is a simple static site generator which is perfect for a personal, blog or documentation site.

It is similar to other static site generators in that it takes your Markdown content, renders it, optimises it and creates a production-ready site that can be served by Nginx, Apache or another web server.

## Features

* Convert Markdown files to static HTML
* [Handlebars](http://handlebarsjs.com) templates and partials
* Sass compiling and minification
* Css reducing (Uncss)
* Javascript concatenating and minification
* Asset copying
* Image compression
* HTML compression
* RSS feed creation
* Server for viewing built site
* Clobber for cleaning build directory
* Save content as draft
* Convert draft templates
* Creates a `build/` directory with built content and assets

## Installation

This project is ideal when used as a Git sub-module or installed along-side your site so you can update it when new releases are made.

### Getting the generator

#### Git sub-module

    $ mkdir my-static-site
    $ cd my-static-site
    $ git init
    $ git submodule add https://github.com/ducksoupdev/gulp-site-generator.git tools

#### Straightforward checkout

    $ mkdir my-static-site
    $ cd my-static-site
    $ git clone https://github.com/ducksoupdev/gulp-site-generator.git tools

### Installing the dependencies

The generator requires Gulp to be installed globally. If you don't have it you can install it using:

    $ npm install -g gulp

The generator has some dependencies that need to be installed using the following script:

    $ node tools/install

The script creates the following files in the root of your site:

* `package.json` - the node modules required by the generator
* `gulpfile.js` - the gulp file for all the generator tasks
* `site.json` - the metadata for your site
* `src/content` - the content folder for the markdown files including some sample ones
* `src/images` - a sample image
* `src/sass` - a sample sass file
* `src/templates` - a set of Handlebar templates for creating pages and posts

Once created, the next thing is to install the required node modules:

    $ npm install

Finally, you can run the generator to create the sample site:

    $ gulp

The generator will create a `build/` folder with the compiled and optimised site ready to be deployed to your web server.

So putting it all together, the installation steps are:

    $ mkdir my-static-site
    $ cd my-static-site
    $ git init
    $ git submodule add https://github.com/ducksoupdev/gulp-site-generator.git tools
    $ npm install -g gulp
    $ node tools/install
    $ npm install
    $ gulp

## Updating

Updating the generator submodule to the latest version can be done using git:

    $ cd tools
    $ git remote update
    $ git pull
    $ cd ..

The generator has an update script that can then be run:

    $ node tools/update

The script updates the `package.json` in the root of your site and updates any dependencies to the latest versions.

## Tasks

When you have created templates, content and assets, the default task will run the generator:

    $ gulp

The following tasks can also be run individually:

* **develop** - a live-reload task for creating and viewing your site where changes are reloaded automatically - view at http://localhost:8080
* **sass** - converts sass files to css
* **clobber** - removes the `build/` directory
* **server** - view your built site locally at http://localhost:8080
* **help** - lists available tasks

## Configuration

The metadata file `site.json` contains all configuration required by your site. The following properties are used by the generator.
You are free to add properties to this file for use in your Handlebars templates.

* title (string) (required) - the title of your site
* description (string) (required) - a description of your site
* url (string) (required) - the URL of your site
* rss (string) (required) - the RSS feed XML file
* maxItems (number) (optional) - the number to use for pagination
* authors (object) (optional) - an map of authors with metadata
* concatJs (array) (optional) - a list of javascript files to combine and minify
* styleSheet (string) (optional) - the name of your main CSS file created by the sass task
* imageCompression (boolean) (optional) - a boolean value to enable/disable image compresssion on build
* uncssIgnore (array) (optional) - a list of selectors that uncss should ignore (for example ".container" or "#my-element")

## Content

Content must be added to the `src/content` directory.

### Pages and posts

Pages and posts must created in the `src/content/pages` and `src/content/posts` directories.

Pages and posts are Markdown files with a YAML front-matter block. The front matter must be the first thing in the file and must take the form of valid YAML set between triple-dashed lines. Here is a basic example:

    ---
    title: Home
    template: index.hbs
    ---

    The rest of the template goes here as markdown text.

Between these triple-dashed lines, you can set predefined variables (see below). These variables will then be available to you in any Handlebars templates or includes that the page or post in question relies on.

* title (required) - the title of the page or post
* template (required) - the Handlebars template to use to compile the page or post
* slug (optional) - the URL slug which is used as the directory name when the page or post is built
* date (optional) - used for posts and in the format YYYY-MM-DD
* author (optional) - used for posts and the author key in the `site.json` file
* status (optional) - set to 'draft' to ignore the page or post when running the generator

### Assets

Images, javascripts, fonts etc can all be added to the `src/` directory. You are free to create directories for these and name them accordingly.

Content is created in the `src/content/pages` or `src/content/posts`.

The generator is opinionated in that it expects certain files in particular directories.
To help with this, [an example site](https://github.com/ducksoupdev/gulp-site-generator-example) is available that shows you how to structure your site with the generator.

### Templates

Handlebars is used for rendering templates. Partials located in `src/templates/partials` are automatically available to your Handlebar templates.

Helpers are available to your Handlebar templates and partials, these are:

* date - format a date in a particular format (uses Moment)

    `{{date format="MMM Do, YYYY"}}`

* excerpt - returns an excerpt of the text of your content, use 'words' or 'characters' to set the length

    `{{excerpt words="50"}}`

* content - returns an excerpt of content and is tag aware, use 'words' or 'characters' to set the length

    `{{content words="50"}}`

* resolve - resolves the path to an asset relative to the site root

    `{{resolve "/favicon.ico"}}`

## Further information

The example site is a good place to start and shows a basic structure of a site with templates and content.

If you encounter any issues or have any feedback, please [send me a tweet](http://twitter.com/ducksoupdev) or raise a bug on the issue tracker.
