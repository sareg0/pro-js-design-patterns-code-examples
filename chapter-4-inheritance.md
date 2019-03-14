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
Creating a class to inherit from Person is a bit more complex:

```js
/* Class Author */

function Author(name, books) {
  Person.call(this, name); // Call the superclass's constructor in the scope of this.
  this.books = books;
}

Author.prototype = new Person(); // Setup the prototype chain.
Author.prototype.constructor = Author; // Set the constructor attribute to Author.
Author.prototype.getBooks = function() { // Add a method to Author.
  return this.books;
};
```


Although JavaScript has no `extends` keyword, every object has an attribute called `prototype`, which either points to another object or to `null`. When a member of an object is accessed (e.g. reader.getName) JavaScript looks for this member in the `prototype` object, if it doesn't exist in the current object. If it is not found, it continues up the chain, accessing each object's `prototype` until the member is found (or until the prototype is `null`). 

In order to make one class inherit from another, you need to set the subclasses prototype (`Author.prototype`) to
point to an instance of the superclass (`Person`).


You can imagine the following

```js
/* Person Class */
function Person(name) {
  this.name = name;
}

Person.prototype.getName = function() {
  return this.name;
}

/* Class Author */
function Author(name, books) {
  Person.call(this, name); // Call the superclass's constructor in the scope of this.
  this.books = books;
}

Author.prototype = new Person(); // Setup the prototype chain.

// Author now inherits the methods from `Person`
const name = Author.getName() //getName inherits from Person
```

Although setting up this inheritance takes three extra lines, creating an instance is the same as with Person:

```js
var author = [];
author[0] = new Author('Dustin Diaz', ['JavaScript Design Patterns']);
author[1] = new Author('Dustin Diaz', ['JavaScript Design Patterns']);

author[1].getName();
author[1].getBooks();
```