// not really a polyfill, just a method I think ought to be part of the array API
Array.prototype.remove = function(elem) {
  const index = this.indexOf(elem);
  if (index >= 0) {
  	this.splice(index, 1);
  }
  return index;
};