
/**
 * Appends a character to the given string.
 * 
 * @param  {string} str  The string to be appended onto.
 * @param  {string} char The character to append.
 * @return {string}      The string with the character appended.
 */
function advanceCharacter (str, char) {
	return str.concat(char);
}

/**
 * Removes the last character of the given string.
 * 
 * @param  {string} str  The string to trim.
 * @return {string}      The string with the last character removed.
 */
function removeCharacter (str) {
	return str.slice(0, -1);
}

/** 
 * 
 * The constructor for a Typed object.
 *
 * @param {DOMElement}       reference  Reference to the DOM node for where to type.
 * @param {object}           settings   Object defining the following settings:
 *   @param {Array.<string>} words      Array of words to type.
 *   @param {number}         timing     Time between each character is typed.
 *	 @param {number}         pause      Stalling time for when word finishes typing.
 *   @param {boolean}        loop       If the process restarts when finished.
 *   @param {number}         startDelay Time before typing animation first begins.
 *   @param {number}         backTiming Timing for the backspace. Default to `timing`.
 *   @param {number}         typoProbability Odds of a typo appeaering and fixing itself, 0-1
 *   @param {number}         maxTypos   The maximum amount of typos to appear per word.
 * @return {void}
 */
function Typed (reference, settings) {
	if (typeof settings !== 'object') {
		throw new TypeError('Error: settings parameter must be an object of settings.');
	}
	if (typeof reference !== 'object') {
  	console.warn('Warning: DOM reference might not be a valid DOM element.');
  }
	this.refDOM = reference;
	this.words = settings.words || [];
  this.timing = settings.timing || 50;
	this.pause = settings.pause || 500;
	this.loop = settings.loop || false;
	this.startDelay = settings.startDelay || 0;
	this.backTiming = settings.backTiming || this.timing;
	this.typoProbability = settings.typoProbability || 0;
	this.maxTypos = settings.maxTypos || 0;
}

/**
 * Begins the process of typing out each of the input words.
 * 
 * @param {void}
 * @return {void}
 */
Typed.prototype.start = function () {
	this.currentWord = 0;
	this.prepare();
	this.addCursor();
	if (this.startDelay > 0) {
		this.typingSection.innerHTML = this.words[this.currentWord]; 
		setTimeout(function () {
			this.delete();
		}.bind(this), this.startDelay);
	} else {
		this.type(this.words[this.currentWord]);
	}
}

/**
 * Creates DOM element to write/delete words into.
 * 
 * @param {void}
 * @return {void}
 */
Typed.prototype.prepare = function () {
	this.refDOM.innerHTML = '';
  this.typingSection = document.createElement('span');
  this.refDOM.appendChild(this.typingSection);
}

/**
 * Creates and adds the cursor element to the DOM
 * 
 * @param {void}
 * @return {void}
 */
Typed.prototype.addCursor = function () {
	var cursor = document.createElement('span');
	cursor.innerHTML = '|';
	cursor.className = 'typed-lite-cursor';
  this.refDOM.appendChild(cursor);
}

/**
 * Types out a single word.
 * 
 * @param {string} word The word to type out.
 * @return {void}
 */
Typed.prototype.type = function (word) {
	if (typeof word !== 'string') {
  	throw new TypeError('Error: Attempting to type out a non-string element: ' + word);
	}
	var typoCount = 0;
  var wordArray = word.split('');
	var partialString = '';
  var typing = function () {
  	var t = setTimeout(function () {
  		this.typingSection.innerHTML = partialString = advanceCharacter(partialString, wordArray.shift());
			if (wordArray.length > 0) {
				if (typoCount < this.maxTypos && this.typoProbability > Math.random()) {
					typoCount++;
					writeTypoAndFix();
				}else {
					typing();
				}
			} else {
				setTimeout(function () {
					clearTimeout(t);
        	this.delete();
        }.bind(this), this.pause);
      }
  	}.bind(this), this.timing);
	}.bind(this);
	var writeTypoAndFix = function () {
		var tp = setTimeout(function () {
			var randomCharacter = String.fromCharCode(97 + parseInt(Math.random() * (122 - 97), 10));
			this.typingSection.innerHTML = partialString = advanceCharacter(partialString, randomCharacter);
			setTimeout(function () {
				clearTimeout(tp);
				this.typingSection.innerHTML = partialString = removeCharacter(this.typingSection.innerHTML);
				typing();
			}.bind(this), this.timing * 2);
		}.bind(this), this.timing);
	}.bind(this);
  typing();
}

/**
 * Deletes the current word within the typed DOM element.
 * 
 * @param {void}
 * @return {void}
 */
Typed.prototype.delete = function () {
	var deleting = function () {
  	var t = setTimeout(function () {
  		this.typingSection.innerHTML = removeCharacter(this.typingSection.innerHTML);
    	if (this.typingSection.innerHTML.length > 0) {
    		deleting();
			} else {
				clearTimeout(t);
      	this.finish();
      } 
  	}.bind(this), this.backTiming);
  }.bind(this);
  deleting();
}

/**
 * Advances onto the next word if there is one. If no words left to type, either starts
 * back from the begining in a loop or terminates.
 * 
 * @param {void}
 * @return {void}
 */
Typed.prototype.finish = function () {
	if (++this.currentWord >= this.words.length) {
		this.currentWord = 0;
		this.loop ? this.type(this.words[this.currentWord]) : 0;
	} else {
		this.typingSection.innerHTML = '';
		setTimeout(function () {
			this.type(this.words[this.currentWord]);
		}.bind(this), 10);
	}
}

exports = module.exports = Typed;

// If attempting to run in browser, push Typed on global window scope
if(typeof window !== 'undefined'){
	 window.Typed = Typed;
}

