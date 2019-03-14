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


### The extend Function

```js
/* Extend Function */

function extend(subClass, superClass) {
  var F = function() {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;
}
```

This function does the same things as in the previous inheritance pattern, in that it sets the `prototype`, then resets to the correct constrcutor (`subClass`);

In contrast to the previous pattern, this function adds the empty class `F` into the prototype chain in order to prevent a new (and possibly large) instance of the superclass from having to be insantiated. 

Since the object that gets instantiated is a throw away, you don't want to create it unecessarily, particularly if its constructor has side effects or is computationally expensive. 

The previous `Person`/`Author` example now looks like this:

```js
/* Class Person. */
function Person(name) {
  this.name = name;
} 

Person.prototype.getName = function() {
  return this.name;
}

/* Class Author. */
function Author(name, books) {
  Person.call(this, name);
  this.books = books;
}

extend(Author, Person);

Author.prototype.getBooks = function() {
  return this.books;
};
```

The drawback to this approach is the name of the superclass (`Person`) is hardcoded within `Author`. It would be better to refer to it in a more general way:

```js
/* Extend function, improved */

function extend(subClass, superClass) {
  var F = function() {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;

  subClass.superClass = superClass.prototype;
  if(superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
}
```

The first three lines of the `extend` function are the same as before. That last lines the `constructor` attribute is set correctly on the superclass. This becomes important when you use this new `superclass` attribute to all the superclass's constructor:

```js
/* Class Author */
function Author(name, books) {
  Author.superclass.constructor.call(this, name);
  this.books = books;
}
extend(Author, Person);

Author.prototype.getBooks = function() {
  return this.books;
};
```
Adding the superclass attribute allows you to call methods from the superclass.

```js
Author.prototype.getName = function() {
  var name = Author.superclass.getName.call(this);
  return name + ', Author of ' + this.getBooks().join(', ');
}
```
