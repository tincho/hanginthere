'use strict';

if (typeof module !== 'undefined') {
    module.exports = SecretWord;
}

function SecretWord(word) {
    var hideChar = arguments[1] || '*';
    this.revealedIds = [];
    this.revealedWord = hideChar.repeat(word.length).split("");
    this.text = word;
    return new Proxy(this, {
        get: (function(target, propertyKey, receiver) {
            this.revealedIds.forEach(propertyAssigner(word, this.revealedWord), this);

            if (propertyKey === 'toString') {
                return constant(this.revealedWord.join(""));
            }

            if (propertyKey in SecretWord.prototype) {
                return SecretWord.prototype[propertyKey].bind(this);
            }

            if (propertyKey in String.prototype) {
                return String.prototype[propertyKey].bind(this.revealedWord.join(""));
            }

            if (propertyKey in Array.prototype) {
                return Array.prototype[propertyKey].bind(this.revealedWord);
            }

            return this.revealedWord[propertyKey];
        }).bind(this),
        set: function(target, propertyKey, receiver) {
            debugger
        }
    });
}

SecretWord.prototype = {
    reveal: function(pos) {
        if (pos instanceof Array) {
            return pos.map(this.reveal, this);
        }
        this.revealedIds.push(pos);
        return this.text[pos];
    },
    occurrences: function(letter, fn) {
        return occurrences(this.text, letter, fn);
    },
    is: function(word) {
        return this.text === word;
    }
};


/*function constant(v) {
    return function() { return v; };
}*/
const constant = v => () => v;
/*function copyProperty(from, to) {
    return function(property) {
        to[property] = from[property];
    }
};*/
const propertyAssigner = (from, to) => (property) => {
    to[property] = from[property]; return to;
};
