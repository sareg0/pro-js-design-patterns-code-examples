### Chapter 1: Expressive Javascript
#### The Flexibility of Javascript

If you're from a procedural language you might do the following:

```javascript
function startAnimation () {
  // ...
}

function stopAnimation () {
  // ...
}
```

The next piece of code allows you to store state and have methods that can act on this state


```javascript
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
```

If you prefer doing it all in one declaration

Animation class with a slightly different syntax for declaring methods

```javascript
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
```

Add a method to the Function object that can be use to declare methods

```javascript
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
```


Function.method.prototype allows you to add new methods to classes. The first agrument is a string and the second a function that will be added to that named

You can take this a step further by modifying `Function.prototype.method` to allow chaining of methods

This allows the calls to be chained

```javascript
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
```

#### A Loosely Typed Language
Things are typed in JavaScript, even if you don't explicitly declare it when defining a variable. 
Primitive types: booleans, numbers, and strings
Other types:
1. functions - they contain executable code
2. Objects - they are called composite datatypes
3. `null` and `undefined` datatypes

Primitive datatypes are passed by value, whereas all other datatypes are passed by references.  - I somehow understand this sentence but would like to find a different word for it.

#### Function as First-Class Objects

Anonymous functions are those that are not given names
An example of an anonymous function executed immediately

```javascript
(function () {
  var foo = 10
  var bar = 2
  alert(foo * bar)
})()
```

The above is defined and executed without ever being assigned to a variable.

An anonymous function with arguments

```javascript
(function (foo, bar) {
  alert(foo * bar)
})(10, 2)
```

Instead of assigning `foo` and `bar` inside the function, they are passed in as parameters.

You can also return a value from a function; below is an example:

```javascript
var baz = (function (foo, bar) {
  return foo * bar
})(10, 2)
// baz will equal 20
```

#### Functions as first class objects
The most interesting use of anonymous functions is to create a closure; a protected variable space, created by nesting functions. In JavaScript, a variable defined within a function is not accessible outside of it; function-level scope. In addition, functions run in the scope they are defined in, not in the scope they are executed in; lexical-scope. These aspects of JavaScript can allow you to create private variables - by wrapping them in anonymous functions.

An anonymous function used as a closure:
```javascript
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
```


#### The Mutability of Objects

In JavaScript everything is an object and everything is mutable
This means you can give attributes to functions:

```javascript
function displayError (message) {
  displayError.numTimesExecuted++
  alert(message)
}
displayError.numTimesExecuted = 0
```

It also means you can modify classes and objects after they have been created;

```javascript
//class Person
function Person (name, age) {
  this.name = name
  this.age = age
}

Person.prototype = {
  getName: function () {
    return this.name
  },
  getAge: function () {
    return this.age
  }
}

// Instantiate the classs
var alice = new Person('Alice', 93)
var bill = new Person('Bill', 30)

// Modify the Class
Person.prototype.getGreeting = function () {
  return 'Hi' + this.getName() + '!'
}

// Modify a specific instance
alice.displayGreeting = function () {
  alert(this.getGreeting())
}

```

Both instances of Person get the `getGreeting` method, due to how the prototype object work. However, only the `alice` instance gets the `displayGreeting` method; no other instance does.

##### Introspection and reflection
introspection is the ability to examine any object at run time to see what attributes and methods it contains.
'Reflection' is using this information to instantiate classes and execute methods dynamically without knowing their names at development time. In JavaScript everything can be modified at run-time

#### Inheritance
JavaScript uses object-based (prototypal) inheritance, which can be used to emulate class-based (classical) inheritance. 

#### Design Patterns in JavaScript
Three reasons to use Design Patterns:
1. *Maintainability* - design patterns help to keep modules loosely coupled (good for refactor and swapping out modules), and can make it easier for large teams to collaborate (cohesion)   
2. *Communication* - design patterns provide a common vocabulary to have high level discussions.
3. *Performance* - some patterns allow you to optimize for performance
Reasons not to use design patterns
1. *Complexity* - may be harder for novice programmers to understand
2. *Performance* = some patterns add a performance overhead


### Summary

JavaScript is...
- flexible, and you can add features it may lack.
- loosely-typed; programmers do not declare types when defining a variable.
- functions are first-class objects; they can be created dynamically, which allows you to create closures. (**not my wording, rework it**)
- all classes and objects are mutable and can be modified at run-time
- you can use two styles of inheritance; prototypal or classical.

