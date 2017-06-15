'use strict';

if (typeof module !== 'undefined') {
  module.exports = SecretWord;
}

function SecretWord(word, hideChar = '*') {
  this.hideChar = hideChar;
  this.revealedIds = [];
  this.revealedWord = hideChar.repeat(word.length).split("");
  this.text = word;
  this._reveal = function(pos) {
    if (pos instanceof Array) {
      return pos.map(this.reveal, this);
    }
    if (pos >= this.text.length) {
      // error!
    }
    let l = this.text[pos];
    this.revealedIds.push(pos);
    this.revealedWord[pos] = l;
    return l;
  };

  return new Proxy(SecretWord.prototype, {
    get: (target, propertyKey, receiver) => {

      if (propertyKey === 'length') {
        return word.length;
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
    },
    set: () => {}
    /*function(target, propertyKey, receiver) {
        debugger
    }*/
  });
}

SecretWord.prototype = {
  reveal: function(pos) {
    return this._reveal(pos);
  },
  occurrences: function(letter, fn) {
    return occurrences(this.text, letter, fn);
  },
  is: function(word) {
    return this.text === word;
  },
  try: function(letter) {
    let matches = this.occurrences(letter);
    this.reveal(matches);
    return this.toString();
  },
  toString: function() {
    return this.revealedWord.join("");
  }
};

const constant = v => () => v;
