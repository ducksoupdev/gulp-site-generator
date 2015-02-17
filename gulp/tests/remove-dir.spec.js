(function () {
    'use strict';

    var removeDir = require('../lib/remove-dir'),
        expect = require('chai').expect,
        fs = require('fs');

    describe('When removing directories', function () {
        beforeEach(function () {
            var files = {
                '/tmp/remove-dir-test/file1': 'This is test content',
                '/tmp/remove-dir-test/file2': 'This is test content',
                '/tmp/remove-dir-test/file3': 'This is test content'
            };

            if (!fs.existsSync('/tmp/remove-dir-test')) {
                fs.mkdirSync('/tmp/remove-dir-test');
            }

            for (var file in files) {
                if (files.hasOwnProperty(file)) {
                    fs.writeFileSync(file, files[file], {encoding: 'utf8'});
                }
            }
        });

        describe('When the temp directory structure is created', function () {
            it('Should have a temp directory structure', function () {
                expect(fs.existsSync('/tmp/remove-dir-test')).to.be.true;
            });

            it('Should have a temp file in the directory', function () {
                expect(fs.existsSync('/tmp/remove-dir-test/file1')).to.be.true;
            });
        });

        describe('When removing the temp directory', function() {
            beforeEach(function() {
                removeDir('/tmp/remove-dir-test');
            });

            it('Should remove the temp directory structure', function () {
                expect(fs.existsSync('/tmp/remove-dir-test')).to.be.false;
            });
        });

        describe('When removing the contents of the temp directory', function() {
            beforeEach(function() {
                removeDir('/tmp/remove-dir-test', false);
            });

            it('Should not remove the temp directory structure', function () {
                expect(fs.existsSync('/tmp/remove-dir-test')).to.be.true;
            });

            it('Should remove the temp file in the directory', function () {
                expect(fs.existsSync('/tmp/remove-dir-test/file1')).to.be.false;
            });
        });

        describe('When a nested directory of files exists', function() {
            beforeEach(function() {
                if (!fs.existsSync('/tmp/remove-dir-test/nested-dir')) {
                    fs.mkdirSync('/tmp/remove-dir-test/nested-dir');
                }
                fs.writeFileSync('/tmp/remove-dir-test/nested-dir/file1', 'This is test content', {encoding: 'utf8'});
            });

            it('Should have a nested directory structure', function () {
                expect(fs.existsSync('/tmp/remove-dir-test/nested-dir/file1')).to.be.true;
            });

            describe('When the nested directory is removed', function() {
                beforeEach(function() {
                    removeDir('/tmp/remove-dir-test');
                });

                it('Should remove the temp directory structure', function () {
                    expect(fs.existsSync('/tmp/remove-dir-test')).to.be.false;
                });
            });
        });
    });
})();
