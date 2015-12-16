/*
 Simple install script for the gulp site generator

 * Copies the gulpfile.js, package.json and site.json files to the project root
 * Creates an src directory
 * Creates the following directories: src/content, src/templates, src/sass, src/content, src/content/pages src/content/posts
 * Creates the following files: src/content/*.md, src/templates/*.hbs, src/sass/*.scss, src/images/*.jpg

 */

var fs = require('fs'),
    path = require('path');

var rootPath = process.cwd();
var rootPathName = path.basename(__dirname);
var filesInstalled = 0;
var directoriesCreated = 0;

var rootFiles = [
    { file: 'gulpfile.js', encoding: 'utf8' },
    { file: 'package.json', encoding: 'utf8' },
    { file: 'site.json', encoding: 'utf8' }
];

var installFiles = {
    directories: [
        'content',
        'content/pages',
        'content/posts',
        'sass',
        'images',
        'templates',
        'templates/partials'
    ],
    files: [
        { file: 'content/index.md', encoding: 'utf8' },
        { file: 'content/template.md', encoding: 'utf8' },
        { file: 'content/pages/about.md', encoding: 'utf8' },
        { file: 'content/posts/sample-blog-post.md', encoding: 'utf8' },
        { file: 'sass/style.scss', encoding: 'utf8' },
        { file: 'images/sample-blog-post.jpg', encoding: 'binary' },
        { file: 'templates/index.hbs', encoding: 'utf8' },
        { file: 'templates/page.hbs', encoding: 'utf8' },
        { file: 'templates/post.hbs', encoding: 'utf8' },
        { file: 'templates/partials/footer.hbs', encoding: 'utf8' },
        { file: 'templates/partials/header.hbs', encoding: 'utf8' },
        { file: 'templates/partials/loop.hbs', encoding: 'utf8' },
        { file: 'templates/partials/navigation.hbs', encoding: 'utf8' },
        { file: 'templates/partials/pagination.hbs', encoding: 'utf8' },
        { file: 'templates/partials/sidebar.hbs', encoding: 'utf8' }
    ]
};

rootFiles.forEach(function (file) {
    if (!fs.existsSync(rootPath + '/' + file.file)) {
        var contents = fs.readFileSync(__dirname + '/' + file.file, file.encoding);

        // replace the path to the gulp tasks
        if (file.file === 'gulpfile.js') {
            contents = contents.replace(/\.\/gulp\/tasks/, './' + rootPathName + '/gulp/tasks/');
        }

        fs.writeFileSync(rootPath + '/' + file.file, contents, {encoding: file.encoding});
        filesInstalled++;
    }
});

if (!fs.existsSync(rootPath + '/src')) {
    fs.mkdirSync(rootPath + '/src');
    directoriesCreated++;
}

installFiles.directories.forEach(function(dir) {
    if (!fs.existsSync(rootPath + '/src/' + dir)) {
        fs.mkdirSync(rootPath + '/src/' + dir);
        directoriesCreated++;
    }
});

installFiles.files.forEach(function(file) {
    if (!fs.existsSync(rootPath + '/src/' + file.file)) {
        var contents = fs.readFileSync(__dirname + '/install/' + file.file, file.encoding);
        fs.writeFileSync(rootPath + '/src/' + file.file, contents, {encoding: file.encoding});
        filesInstalled++;
    }
});

console.info(directoriesCreated + ' directories created and ' + filesInstalled + ' files installed!');
if (directoriesCreated && filesInstalled) {
    console.info('Run \'npm install\' then \'gulp\' to get started');
}