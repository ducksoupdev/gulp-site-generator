# Change log

## v0.4.0 (2017-08-27)

**Features**

* Replace livereload with browser-sync [#35]
* Replace uncss with sass in develop task [#35]
* Uplift npm packages

## v0.3.2 (2017-02-24)

**Fixes**

* Fix update script to ignore installing `content/template.md` if missing

## v0.3.1 (2017-02-23)

**Features**

* Open browser in development task
* Open browser in server task

## v0.3.0 (2017-02-23)

**Features**

* Change tasks for development - run specific tasks on changes
* Draft posts/pages are compiled by default in development
* Uplift npm packages
* Add editorconfig to installed files
* Update gitignore
* Code cleanup

## v0.2.2 (2017-02-09)

**Fixes**

* Added eslint [#28]
* New lines for some files [#28]
* Changed .editorconfig to use utf-8 [#28]

## v0.2.1 (2017-01-24)

**Features**

* Removed comma in getTagsAsLinks [#27]

## v0.2.0 (2017-01-11)

**Features**

* Refactor compilation [#26]
* Uplift npm packages
* Remove temp files
* Code cleanup
* Fix image npm module versions

## v0.1.29 (2017-01-11)

**Features**

* Add cssIgnore configuration option

## v0.1.28 (2016-11-11)

**Fixes**

* Fix livereload race condition + HBS watch [#24]

## v0.1.27 (2016-01-03)

**Fixes**

* Fix issue with Handlebars date helper and the wrong format.

## v0.1.26 (2016-01-03)

**Fixes**

* Fix issue with missing node modules after running update script.

## v0.1.25 (2016-01-02)

**Features**

* Add image compression setting to site.json. If set to false, no image compression is performed.

## v0.1.24 (2015-12-30)

**Features**

* Add update script for easy node module upgrades. Readme edited with info on how to update.
* Refactor install script
* Code cleanup

## v0.1.23 (2015-12-29)

**Features**

* Update install script to modify package.json dependencies
* Uplift node modules

**Fixes**

* Update Travis CI build config

## v0.1.22 (2015-12-29)

**Features**

* Support leaving out the initial --- for front-matter [#12]
* Support tags defined as an array as well as a string [#13]

**Fixes**

* Fix automatically generated slug doesn't link correctly [#11]
* Fix post sorting is not correct [#10]

## v0.1.21 (2015-12-16)

**Fixes**

* Fix missing pagination partial from the install script

## v0.1.20 (2015-11-11)

**Features**

* Add site data to individual pages or posts

**Fixes**

* Fix issue with pagination on home, date and tag pages

## v0.1.19 (2015-10-09)

**Fixes**

* Fix sidebar dates and tags

## v0.1.18 (2015-10-09)

**Features**

* Update readme and add help task

## v0.1.17 (2015-10-06)

**Fixes**

* Fix develop task to watch files in `src` and run default task

## v0.1.16 (2015-09-23)

**Fixes**

* Add auto-generated changelog

## v0.1.15 (2015-09-23)

**Fixes**

* Fix compile rss tests

## v0.1.14 (2015-09-22)

**Features**

* Replace imagemin-jpegoptim with imagemin-mozjpeg
* Uplift node modules

**Breaking changes**

* If installed as a sub-module, you'll need to update your package.json in the root of your project as several node modules have been updated


## v0.1.13 (2015-07-29)

**Features**

* Add slug as optional page or post variable.

**Breaking changes**

* If installed as a sub-module, you'll need to update your package.json in the root of your project as several node modules have been updated


## v0.1.12 (2015-07-11)

**Notes**

* Uplift node modules


## v0.1.11 (2015-02-26)

**Fixes**

* Fix an issue where date pages were skipped if tags exist


## v0.1.10 (2015-02-26)

**Fixes**

* Fix example handlebars templates


## v0.1.9 (2015-02-26)

**Fixes**

* Fix issue with pagination paths in tests


## v0.1.8 (2015-02-26)

**Fixes**

* Fixed an issue with promises on tests
* Fixed an issue with incorrect URLs on originated pages

**Breaking changes**

New npm dev module `gulp-coveralls`
New npm module `mout`


## v0.1.7 (2015-02-25)

*  Update to generate full paginated pages
*  Update so pages/posts can be stored anywhere in src/content
*  Update README to include coveralls badge
*  Add coveralls coverage
*  Update node version for travis ci
*  Add pages array to handlebars template data


## v0.1.5 (2015-02-19)

*  Add RSS feed feature to readme
*  Add install sample files


## v0.1.4 (2015-02-18)

*  Improve test coverage
*  Update readme for install script
*  Implement install script


## v0.1.3 (2015-02-17)

*  Add minify css to copy-css task


## v0.1.2 (2015-02-17)

*  Fix error handling on no content


## v0.1.1 (2015-02-17)

*  Update copy tasks to remove dependencies


## v0.1.0 (2015-02-17)

*  Initial commit
