// If you're from a procedural language you might do the following:

function startAnimation () {
  // ...
}

function stopAnimation () {
  // ...
}

//The next piece of code allows you to store state and have methods that can act on this state
// Animation class

var Animation = function () {
  // ...
}

Animation.prototype.start = function () {
  // ...
}

Animation.prototype.stop = function () {
  // ...
}

// Usage
var myAnimation = new Animation()
myAnimation.start()
// ...
myAnimation.stop()

// If you prefer doing it all in one declaration

//Animation class with a slightly different syntax for declaration methods

var Animation = function () {
 // ...
}

Animation.prototype = {
  start: function () {
    // ...
  },
  stop: function () {
    // ...
  }
}


// Add a method to the Function object that can be use to declare methods
Function.prototype.method = function (name, fn) {
  this.prototype[name] = fn
} 

// Animation class, with methods created using a convenience method
var Animation = function () {
  // ...
}

Animation.method('start', function () {
  // ...
})
Animation.method('stop', function () {
  // ...
})


// Function.method.prototype allows you to add new methods to classes. The first agrument is a string and the second a function
// that will be added to that named

// You can take this a step further by modifying `Function.prototype.method` to allow chaining of methods

// This allows the calls to be chained

Function.prototype.method = function (name, fn) {
  this.prototype[name] = fn
  return this
}

// Animation class, with methods created using a convenience method and chaining

var Animation = function () {
  // ...
}

Animation
  .method('start', function () {
    // ...
  })
  .method('stop', function () {
    // ...
  })


// Anonymous functions are those that are not given names
// An example of an anonymous function executed immediately
(function () {
  var foo = 10
  var bar = 2
  alert(foo * bar)
})()

// The above is defined and executed without ever being assigned to a variable.

// An anonymous function with arguments
(function (foo, bar) {
  alert(foo * bar)
})(10, 2)

// Instead of assignging the foo and bar inside the function, they are passed in as parameters.

// You can also return a value from a function; below is an example:
var baz = (function (foo, bar) {
  return foo * bar
})(10, 2)
// baz will equal 20

// #### Function as a first class objects
// The most interesting use of anonymous functions is to create a closure; a protected variable space, created by using nesting function;
// In JavaScript, a variable defined within a function is not accessible outside of it; this is called function-level scope. 
// In addition, functions run in the scope they are defined in, not in the scope they are executed in; this is called lexical-scope.
// These aspects of JavaScript can allow you to create private variables - by wrapping them in anonymous functions.

// An anonymous function used as a closure
var baz;

(function () {
  var foo = 10
  var bar = 2
  baz = function () {
    return foo * bar
  }
})()

baz() 
// baz can access foo and bar, even though it is executed outside of the anonymous function


// Stopping point The Mutability of Objects