
/**
 * 
 * 
 * 
 * 
 */
function advanceCharacter (str, char) {
	return str.concat(char);
}

/**
 * 
 * 
 * 
 * 
 */
function removeCharacter (str) {
	return str.slice(0, -1);
}

/**
 * @param {Array.<string>} words  Array of words to type.
 * @param {number}			   timing Time between each character is typed.
 * @param {number} 				 pause  Stalling time for when word finishes typing.
 */
function Typed (refDOM, words, timing, pause) {
	if (typeof refDOM !== 'object') {
  	console.warn('Warning: DOM reference might not be a valid DOM element.');
  }
	this.refDOM = refDOM;
	this.words = words || [];
  this.timing = timing || 50;
  this.pause = pause || 500;
}

/**
 * 
 * 
 * 
 * 
 */
Typed.prototype.start = function () {
	console.log('preping')
	this.prepare();
	console.log('adding cursor...')
	this.addCursor();
	console.log('typing first word...')
	this.type(this.words[0]);
}

/**
 * 
 * 
 * 
 * 
 */
Typed.prototype.prepare = function () {
	this.refDOM.innerHTML = '';
  this.typingSection = document.createElement('span');
  this.refDOM.appendChild(this.typingSection);
}

/**
 * 
 * 
 * 
 * 
 */
Typed.prototype.addCursor = function () {
	var cursor = document.createElement('span');
  cursor.innerHTML = '|';
  this.refDOM.appendChild(cursor);
}

/**
 * 
 * 
 * 
 * 
 */
Typed.prototype.type = function (word) {
	if (typeof word !== 'string') {
  	throw new TypeError('Error: Attempting to type out a non-string element: ' + word);
  }
  var wordArray = word.split('');
	var partialString = '';
  var typing = function () {
  	setTimeout(function () {
  		this.typingSection.innerHTML = partialString = advanceCharacter(partialString, wordArray.shift());
    	if (wordArray.length > 0) {
    		typing();
    	} else {
      	setTimeout(function () {
        	this.delete();
        }.bind(this), this.pause);
      }
  	}.bind(this), this.timing);
  }.bind(this);
  typing();
}

/**
 * 
 * 
 * 
 * 
 */
Typed.prototype.delete = function () {
  var deleting = function () {
  	setTimeout(function () {
  		this.typingSection.innerHTML = removeCharacter(this.typingSection.innerHTML);
    	if (this.typingSection.innerHTML.length > 0) {
    		deleting();
    	} else {
      	this.finish();
      }
  	}.bind(this), this.timing);
  }.bind(this);
  deleting();
}

/**
 * 
 * 
 * 
 * 
 */
Typed.prototype.finish = function () {
	console.log('done!')
}


exports = module.exports = Typed;

// If attempting to run in browser, push Typed on global window scope
if(typeof window !== 'undefined'){
	 window.Typed = Typed;
}
