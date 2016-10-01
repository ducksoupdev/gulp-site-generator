"use strict";

var compileOptions = require("../lib/compile-options"),
    Handlebars = require("handlebars"),
    expect = require("chai").expect;

describe("Given the compile options", function () {
    describe("When using the date helper", function () {
        beforeEach(function () {
            Handlebars.registerHelper("date", compileOptions(".").helpers.date);
            this.html = "<span>{{date format=\"MMM Do, YYYY\"}}</span>";
        });

        it("Should format the date as MMM Do, YYYY", function () {
            var template = Handlebars.compile(this.html);
            var result = template({
                date: "2015-10-15"
            });
            expect(result).to.equal("<span>Oct 15th, 2015</span>");
        });
    });

    describe("When using the excerpt helper", function () {
        describe("When using the excerpt helper with characters", function () {
            beforeEach(function () {
                Handlebars.registerHelper("excerpt", compileOptions(".").helpers.excerpt);
                this.html = "<p>{{{excerpt characters=100}}}...</p>";
            });

            it("Should return an excerpt of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut."
                });
                expect(result).to.equal("<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake po...</p>");
            });
        });

        describe("When using the excerpt helper with words", function () {
            beforeEach(function () {
                Handlebars.registerHelper("excerpt", compileOptions(".").helpers.excerpt);
                this.html = "<p>{{{excerpt words=20}}}...</p>";
            });

            it("Should return an excerpt of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut."
                });
                expect(result).to.equal("<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw...</p>");
            });
        });

        describe("When using the excerpt helper without words or characters", function () {
            beforeEach(function () {
                Handlebars.registerHelper("excerpt", compileOptions(".").helpers.excerpt);
                this.html = "<p>{{{excerpt}}}...</p>";
            });

            it("Should return an excerpt of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut."
                });
                expect(result).to.equal("<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut....</p>");
            });
        });
    });

    describe("When using the content helper", function () {
        describe("When using the content helper with characters", function () {
            beforeEach(function () {
                Handlebars.registerHelper("content", compileOptions(".").helpers.content);
                this.html = "{{{content characters=100}}}";
            });

            it("Should return an content of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut.</p>"
                });
                expect(result).to.equal("<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake po</p>");
            });
        });

        describe("When using the content helper with words", function () {
            beforeEach(function () {
                Handlebars.registerHelper("content", compileOptions(".").helpers.content);
                this.html = "{{{content words=20}}}";
            });

            it("Should return an content of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut.</p>"
                });
                expect(result).to.equal("<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw</p>");
            });
        });

        describe("When using the content helper without words or characters", function () {
            beforeEach(function () {
                Handlebars.registerHelper("content", compileOptions(".").helpers.content);
                this.html = "{{{content}}}";
            });

            it("Should return an content of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut.</p>"
                });
                expect(result).to.equal("<p>Gingerbread marshmallow fruitcake topping jelly-o halvah. Dragée icing cheesecake. Apple pie cake powder biscuit gingerbread tart gingerbread bonbon. Bear claw danish cake pie gummi bears macaroon tart jujubes toffee Candy canes brownie oat cake gummi bears cupcake powder donut.</p>");
            });
        });

        describe("When using the content helper with no words", function () {
            beforeEach(function () {
                Handlebars.registerHelper("content", compileOptions(".").helpers.content);
                this.html = "{{{content words=0}}}";
            });

            it("Should return an content of the given text", function () {
                var template = Handlebars.compile(this.html);
                var result = template({
                    description: "<p><img src=\"test.png\" alt=\"\"><span>Image</span></p>"
                });
                expect(result).to.equal("<p><img src=\"test.png\" alt=\"\"><span></span></p>");
            });
        });
    });

    describe("When using the resolve helper", function () {
        beforeEach(function () {
            Handlebars.registerHelper("resolve", compileOptions(".").helpers.resolve);
            this.html = "<link rel=\"shortcut icon\" href=\"{{resolve \"/favicon.ico\"}}\">";
        });

        it("Should return a resolved path", function () {
            var template = Handlebars.compile(this.html);
            var result = template({
                resourcePath: ".."
            });
            expect(result).to.equal("<link rel=\"shortcut icon\" href=\"../favicon.ico\">");
        });

        it("Should return a resolved path if no resourcePath is set", function () {
            var template = Handlebars.compile(this.html);
            var result = template({});
            expect(result).to.equal("<link rel=\"shortcut icon\" href=\"favicon.ico\">");
        });
    });

    describe("When using the checkContent function", function () {
        it("Should check the content and add missing page meta data", function () {
            var fileData = {
                body: "<p>Test page content.</p> <p>Blah blah blah</p>"
            };
            fileData = compileOptions().checkContent(fileData);

            expect(fileData).to.deep.equal({
                slug: "test-page-content-blah-blah-blah",
                template: "page.hbs",
                title: "Test page content. Blah blah blah",
                body: "<p>Test page content.</p> <p>Blah blah blah</p>"
            });
        });

        it("Should check the content and add missing post meta data", function () {
            var fileData = {
                date: "2015-02-23",
                body: "<p>Test post content.</p> <p>Blah blah blah</p>"
            };
            fileData = compileOptions().checkContent(fileData);

            expect(fileData).to.deep.equal({
                slug: "test-post-content-blah-blah-blah",
                template: "post.hbs",
                title: "Test post content. Blah blah blah",
                date: "2015-02-23",
                body: "<p>Test post content.</p> <p>Blah blah blah</p>"
            });
        });
    });

    describe("When using the or helper", function () {
        beforeEach(function () {
            Handlebars.registerHelper("or", compileOptions(".").helpers.or);
            this.html = "<div>{{#if (or val1 val2)}}<span>Values matched</span>{{else}}<span>Values not matched</span>{{/if}}</div>";
        });

        it("Should output the correct html when the values exist", function () {
            var template = Handlebars.compile(this.html);
            var result = template({
                val1: "Test"
            });
            expect(result).to.equal("<div><span>Values matched</span></div>");
        });

        it("Should output the correct html when the values do not exist", function () {
            var template = Handlebars.compile(this.html);
            var result = template({});
            expect(result).to.equal("<div><span>Values not matched</span></div>");
        });
    });
});

