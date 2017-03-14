'use strict';

if (typeof require !== 'undefined') {
    var expect = require('chai').expect;

    require('../js/common.js');
    var SecretWord = require('../js/secretWord.js');
}

describe("Secret Word", function() {

    const hideChar = '*';
    var s,
        word = "piriri",
        hiddenWord = hideChar.repeat(word.length).split("");
    beforeEach(function() {
        s = new SecretWord(word);
    });

    it("should proxy .toString() method", function() {
        expect(s.toString()).to.eql(hiddenWord.join(""));
    });

    it("should proxy [] operator", function() {
        expect(s[0]).to.eql(hideChar);
        expect(s[word.length - 1]).to.eql(hideChar);
        expect(s[word.length + 1]).to.eql(undefined);
    });

    it("should proxy string methods", function() {
        expect(s.charAt(0)).to.eql(hideChar);
        expect(s.split("")).to.eql(hiddenWord);
    });

    it("should proxy array methods", function() {
        expect(s.map(e => e)).to.eql(hiddenWord);
    });

    // WHY would I want these two???!
    it("should reveal one letter", function() {
        var revealed = s.reveal(1);
        expect(s[1]).to.eql(word[1]);
        expect(s.toString()).to.eql(hideChar+revealed+hideChar.repeat(word.length - 2));
    });

    it("should reveal array of letters", function() {
        var revealed = s.reveal([0, 1, 2]);
        expect(true);
    });

    // o right, to do this!
    it("should reveal be used as callback", function() {
        var o = s.occurrences("i", s.reveal);
        // they are revealed!!
        expect(s.indexOf("i")).to.eql(o[0]);
        expect(s.indexOf("i", 2)).to.eql(o[1]);
        expect(s.indexOf("i", 4)).to.eql(o[2]);
        expect(s.toString()).to.eql("*i*i*i");
    });

    // works both ways! this test is just to show-off (?)
    it("should reveal from occurrences returned array", function() {
        var revealed = s.reveal(s.occurrences("i"));
        expect(true);
    });

    it("should return occurrences", function() {
        expect(s.occurrences("i")).to.eql([1, 3, 5]);
    });

    it("should say if is a given word", function() {
        expect(s.is(word)).to.eql(true);
        expect(s.is("hello")).to.eql(false);
    })

    describe("Custom mask char", function() {
        it("should be set on constructor", function() {
            var    ss = new SecretWord("hideme", "x");
            var    su = new SecretWord("hideme", "_");
            expect(ss.toString()).to.eql("xxxxxx")
            expect(su.toString()).to.eql("______");
        });

        it("should set default as *", function() {
            var s = new SecretWord("hi");
            expect(s.toString()).to.eql("**");
        });
    });

    decribe("Setting things", function() {
        it("should ... ?", function() {
            s.testProp = "aaa";
        });
    });

    it("should not pass this test", function() {

        var s = new SecretWord("piriri");

        s.test = "pp";
        console.log(s["test"]);
        // reveal one char position
        /*s.reveal(0);
        console.log(s[0]);

        // reveal from array of char positions
        s.reveal(s.occurrences("r"));
        // given occurrences 2nd arg callback, also works both ways! :)
        s.occurrences("i", s.reveal);
        console.log(s.toString());
        expect(false).to.eql(true);*/
    });
});
