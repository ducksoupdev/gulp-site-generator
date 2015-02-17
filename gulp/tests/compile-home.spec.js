(function () {
    'use strict';

    var compileHome = require('../lib/compile-home'),
        removeDir = require('../lib/remove-dir'),
        expect = require('chai').expect,
        mockery = require('mockery'),
        sinon = require('sinon'),
        fs = require('fs');

    describe('Given the home page', function () {
        var rootPath = '/tmp/compile-home';
        var doneStub, errorStub;

        before(function () {
            doneStub = sinon.stub();
            errorStub = sinon.stub();

            // create the root path
            if (!fs.existsSync(rootPath)) {
                fs.mkdirSync(rootPath);
            }

            // set-up folders:
            [
                '/src',
                '/src/templates',
                '/src/templates/partials',
                '/build',
                '/build/pagination',
                '/build/pagination/index',
                '/build/content',
                '/build/content/pages',
                '/build/content/posts'
            ].forEach(function (dir) {
                    if (!fs.existsSync(rootPath + dir)) {
                        fs.mkdirSync(rootPath + dir);
                    }
                });

            // set-up files:
            fs.writeFileSync(rootPath + '/site.json', '{"title":"Test site"}', {encoding: 'utf8'});
            fs.writeFileSync(rootPath + '/src/templates/partials/loop.hbs', '{{#each posts}}<li><a href="{{url}}">{{title}}</a></li>{{/each}}', {encoding: 'utf8'});
            fs.writeFileSync(rootPath + '/src/templates/index.hbs', '<div><ul>{{> loop}}</ul></div>', {encoding: 'utf8'});
        });

        describe('When compiling the home page', function () {
            before(function (done) {
                fs.writeFileSync(rootPath + '/build/content/pages/test-page.json', '{"slug":"test-page","title":"Test page","template":"page.hbs","body":"<p>Test page content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post.json', '{"slug":"test-post","title":"Test post","template":"post.hbs","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                compileHome.run(rootPath, done, errorStub);
            });

            it('Should create the static home page', function () {
                expect(fs.existsSync(rootPath + '/build/index.html')).to.be.true;
            });

            it('Should have the correct home page content', function () {
                expect(fs.readFileSync(rootPath + '/build/index.html', 'utf8')).to.equal('<div><ul><li><a href="./test-page/">Test page</a></li><li><a href="./test-post/">Test post</a></li></ul></div>');
            });
        });

        describe('When compiling the home page excluding draft templates', function () {
            before(function (done) {
                fs.writeFileSync(rootPath + '/build/content/pages/test-page.json', '{"slug":"test-page","title":"Test page","template":"page.hbs","body":"<p>Test page content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post.json', '{"slug":"test-post","title":"Test post","template":"post.hbs","status":"draft","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                compileHome.run(rootPath, done, errorStub);
            });

            it('Should have the correct home page content', function () {
                expect(fs.readFileSync(rootPath + '/build/index.html', 'utf8')).to.equal('<div><ul><li><a href="./test-page/">Test page</a></li></ul></div>');
            });
        });

        describe('When compiling the home page with pagination', function () {
            before(function (done) {
                fs.writeFileSync(rootPath + '/site.json', '{ "title": "Test site", "maxItems": "2" }', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/pages/test-page.json', '{"slug":"test-page","title":"Test page","template":"page.hbs","body":"<p>Test page content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post1.json', '{"slug":"test-post1","title":"Test post 1","template":"post.hbs","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post2.json', '{"slug":"test-post2","title":"Test post 2","template":"post.hbs","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post3.json', '{"slug":"test-post3","title":"Test post 3","template":"post.hbs","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post4.json', '{"slug":"test-post4","title":"Test post 4","template":"post.hbs","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                fs.writeFileSync(rootPath + '/build/content/posts/test-post5.json', '{"slug":"test-post5","title":"Test post 5","template":"post.hbs","body":"<p>Test post content</p>"}', {encoding: 'utf8'});
                compileHome.run(rootPath, done, errorStub);
            });

            it('Should have the correct home page content', function () {
                expect(fs.readFileSync(rootPath + '/build/index.html', 'utf8')).to.equal('<div><ul><li><a href="./test-page/">Test page</a></li><li><a href="./test-post1/">Test post 1</a></li></ul></div>');
            });

            it('Should create the second paginated home page', function () {
                expect(fs.existsSync(rootPath + '/build/pagination/index/2/index.html')).to.be.true;
            });

            it('Should create the third paginated home page', function () {
                expect(fs.existsSync(rootPath + '/build/pagination/index/3/index.html')).to.be.true;
            });

            it('Should have the correct home page content for the second paginated page', function () {
                expect(fs.readFileSync(rootPath + '/build/pagination/index/2/index.html', 'utf8')).to.equal('<li><a href="./test-post2/">Test post 2</a></li><li><a href="./test-post3/">Test post 3</a></li>');
            });

            it('Should have the correct home page content for the third paginated page', function () {
                expect(fs.readFileSync(rootPath + '/build/pagination/index/3/index.html', 'utf8')).to.equal('<li><a href="./test-post4/">Test post 4</a></li><li><a href="./test-post5/">Test post 5</a></li>');
            });
        });

        describe('When an error occurs with the promises', function() {
            beforeEach(function(done) {
                removeDir(rootPath);
                fs.mkdirSync(rootPath);
                fs.writeFileSync(rootPath + '/site.json', '{"title":"Test site"}', {encoding: 'utf8'});
                compileHome.run(rootPath, done, function() {
                    errorStub();
                    done();
                });
            });

            it('Should call the error function', function() {
                expect(errorStub.called).to.be.true;
            });
        });

        describe('When a glob error occurs', function() {
            var globStub, newCompileHome;

            beforeEach(function(done) {
                removeDir(rootPath);
                fs.mkdirSync(rootPath);
                fs.writeFileSync(rootPath + '/site.json', '{"title":"Test site"}', {encoding: 'utf8'});

                mockery.enable({
                    warnOnReplace: false,
                    warnOnUnregistered: false,
                    useCleanCache: true
                });

                globStub = function(paths, options, callback) {
                    callback({
                        message: 'I threw an error'
                    }, null);
                };

                mockery.registerMock('globby', globStub);

                newCompileHome = require('../lib/compile-home');

                newCompileHome.run(rootPath, function() {
                    done();
                }, function(err) {
                    errorStub(err);
                    done();
                });
            });

            it('Should throw a glob error', function() {
                expect(errorStub.called).to.be.true;
            });

            it('Should throw a specific error', function() {
                expect(errorStub.calledWith({ message: 'I threw an error' })).to.be.true;
            });

            afterEach(function() {
                mockery.disable();
            });
        });

        after(function () {
            removeDir(rootPath);
        });
    });
})();
