# Inheritance

## Why Do You Need Inheritance?
Iheritance helps you build off other classes and leverage the methods they already have.

## Classical Inheritance
A basic class declaration in JavaScript:

```js
/* Class Person. */

function Person(name) {
  this.name = name;
}

Person.prototype.getName = function() {
  return this.name;
}
```
- the constructor; is the name of the class with a capital letter
- within the constructor use `this` to create instance attributes
- to create instance methods add them to the class' `prototype` object
- to create an instance of the class invoke the constructor using the `new` keyword:

```js
var reader = new Person('Steven Universe');
reader.getName();
```

### The Prototype Chain
