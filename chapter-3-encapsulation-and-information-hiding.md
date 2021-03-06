# Encapsulation and Information Hiding

Intro:
- JavaScript has no mechanisms for declaring members to be public or private

## The Information Hiding Principle
The information hiding principle serves to reduce the interdependency of two actors in a system:

all information between two actors should be obtained between well defined channels. In this case, these channels are your interfaces.

### Encapsulation vs. Information Hiding
Information hiding = the goal
Encapsulation = the technique to accomplish that goal

In JavaScript we will use the concept of a closure to create methods and attributes that can only be accessed from withing the object.

#### The Role of the Interface
An interface provides a contract, the defines the publicly accessible methods.
It defines the relationship that two objects can have; either object in this relationship can be replaced as long as the interface is maintained.

### Basic Patterns
There are three patterns we will look at here

1. the fully exposed object; provides only public methods.
2. using underscores to denote methods and attributes that are intended to be private.
3. using closures to create true private members, which can only be accessed via priviledged methods. 

Example. 
You are given an assignment: create a class to store data about a book, and implement a method for displaying the book's data in HTML. You will only be creating the class; other programmers will be instantiating it. 

```js
// Book (isbn, title, author)

var theHobbit = new Book('0-395-07122-4', 'The Hobbit', 'J. R. R. Tolkien');

theHobbit.display(); // Outputs the data by creating and populating an html element.
```

#### Fully Exposed Object
```js
var Book = function(isbn, title, author) {
  if(isbn == undefined) throw new Error('Book constructor requires an isbn.')
  this.isbn = isbn
  this.title = title || 'No title specified';
  this.author = author || 'No author specified';
}

Book.prototype.display = function() {
  // ...
};
```

The class meets most needs, however it doesn't verify the integrity of the ISBN. This may cause the display method to fail, breaking the contract you have with other programmers. 

To fix this you implement stronger checks on the ISBN.

```js
var Book = function(isbn, title, author) {
  if(!this.checkIsbn(isbn)) throw new Error('Book: Invalid ISBN.');
  this.isbn = isbn;
  this.title = title || 'No title specified';
  this.author = author || 'No author specified';
}

Book.prototype = {
  checkIsbn: function(isbn) {
    if(isbn == undefined || typeof isbn != 'string') {
      return false;
    }

    var sum = 0;
    if(isbn.length === 10) { //10 digit ISBN
      if(!isbn.match(\^\d{9}\)) { //ensure characters 1 through 9 are digits
        return false;
      }

      for(var i = 0; i < 9; i++) {
        sum += isbn.charAt(i) * (10 - i);
      }
      var checksum = sum % 11;
      if(checksum === 10) checksum = 'X';
      if(isbn.charAt(9) != checksum) {
        return false;
      }
    }
    else { //13 digit ISBN
      if(!isbn.match(\^\d{12}\)) { // Ensure characters 1 through 12 are digits
        return false;
      }

      for(var i = 0; i < 12; i++) {
        sum += isbn.charAt(i) * ((i % 2 === 0) ? 1 : 3);
      }
      var checksum = sum % 10;
      if(isbn.charAt(12) != checksum) {
        return false;
      }
    }

    return true; // All tests passed
  },

  display: function() {
    // ...
  }
};
```

You are now able to verify that an ISBN is valid. However, another programmer notices that a book may have multiple editions, each with its own ISBN. They create an algorithm for selecting among these editions and are using it to change the `isbn` attibute directly, after instantiating the object. 

```js
theHobbit.isbn = `978-0261103283`;
theHobbit.display();
```

In order to protect internal data you creat accessor and mutator methods for each attribute.

_Accessor methods_ (usually named in the form `getAttributeName`) get the value of any of the attributes and are 

_Mutator methods_ (usually named in the form `setAttributeName`) set the value of an attributes.

```js
var Publication = new Interface('Publication', ['getIsbn', 'setIsbn', 'getTitle', 'setTitle', 'getAuthor', 'setAuthor', 'display']);

var Book = function(isbn, title, author) { // implements Publication
  this.setIsbn(isbn);
  this.setTitle(title);
  this.setAuthor(author);
}

Book.prototype = {
  checkIsbn: function(isbn) {
    // ...
  },
  getIsbn: function() {
    return this.isbn;
  },
  setIsbn: function(isbn) {
    if(!this.checkIsbn(isbn)) throw new Error('Book: Invalid ISBN.');
    this.isbn = isbn;
  },
  getTitle: function() {
    return this.title;
  },
  setTitle: function(title) {
    this.title = title || 'No title specified';
  },
  getAuthor: function() {
    return this.author;
  },
  setAuthor: function(author) {
    this.author = author || 'No author specified';
  }
  display: function() {
    // ...
  }
};
```

#### Benefits of this approach:
- easy to learn for new programmers
- subclassing and unit testing are very easy
- well-defined interface

#### Drawbacks of this approach:
- the attributes are still public, and can still be set directly


### Private Methods Using a Naming Convention
```js
var Book = function(isbn, title, author) { // implements Publication
  this.setIsbn(isbn);
  this.setTitle(title);
  this.setAuthor(author)
}

Book.prototype = {
  checkIsbn: function() {
    // ...
  },
  getIsbn: function() {
    return this._isbn
  },
  setIsbn: function(isbn) {
    if(!this.checkIsbn(isbn)) throw new Error('Book: Invalid ISBN.');
    this._isbn = isbn;
  },

  getTitle: function() {
    return this._title;
  },
  setTitle: function(title) {
    this._title = title || 'No title specified';
  },

  getAuthor: function() {
    return this._author;
  },
  setAuthor: function() {
    this._author = author || 'No author specified';
  },

  display: function() {
    // ...
  }
};
```
This underscores at the beginning of each attributes indicates it is intended to be private.
This naming convention can be applied to methods also.

#### Benefits
- using an underscore is a well known naming convention
- all the benefits of the 'fully exposed object' pattern

#### Drawbacks
- needs to be fully agreed upon by the programmers working on a project to be of any use.
- not a real protection for private attributes.

### Scope, Nested Functions, and Closures
Scope helps us make attributes inaccessible to the outside, except via a function.


```js
function foo() {
  var a = 10;

  function bar() {
    a *= 2;
  }

  bar();
  return a;
}
```

The variable `a` is accessible to the function `bar` because `bar` is declared in the same scope as `a` (inside `foo`).


```js
function foo() {
  var a = 10;

  function bar() {
    a *= 2;
    return a;
  }

  return bar;
}

var baz = foo(); // `baz` is now a reference to function `bar`
baz(); // returns 20;
baz(); // returns 40;
baz(); // returns 80;

var blat = foo(); // `blat` is another reference to `bar`;
blat(); // returns 20, because a new copy of `a` is being used;
```

This is an example of a closure. The most common way of creating a closure is returning a nested function.

### Private Members Through Closures
```js
var Book = function(newIsbn, newTitle, newAuthor) { // Implements publication

  // Private attributes.
  var isbn, title, author;

  // Private method.
  function checkIsbn(isbn) {
    // ...
  }

  // Privileged methods.
  this.getIsbn = function() {
    return isbn;
  };
  
  this.setIsbn = function(newIsbn) {
    if(!checkIsbn(newIsbn)) throw new Error('Book: Invalid ISBN.');
    isbn = newIsbn;
  };

  this.getTitle = function() {
    return title;
  };

  this.setTitle = function(newTitle) {
    title = newTitle || 'No title specified';
  };

  this.getAuthor = function() {
    return author;
  };

  this.setAuthor = function(newAuthor) {
    author = newAuthor || 'No author specified';
  };

  // Contribute code.
  this.setIsbn(newIsbn);
  this.setTitle(newTitle);
  this.setAuthor(newAuthor);
};

// Public, non-privileged methods.
Book.prototype = {
  display: function() {
    // ...
  }
};
```

In the previous example, attributes were referred to use the `this` keyword, but here they are declared using `var`; meaning they only exist in the `Book` constructor.
the `checkIsbn` method is created in the same way, making it a private method.

The _privileged_ methods are publicly accessible, but they have access to the private attributes because they are declared with the `Book` constructor's scope.

Public methods that do not need access to the private attributes can be declared in the `Book.prototype`.


Only make a method privileged if it needs direct access to private attributes. Having too many privileged methods can also cause memory problems.

With this pattern it is impossible for a programmer to get direct access to any of the data of a `Book` instance; they are forced to go through setter or mutator methods.

### Drawbacks
- every new instance also copies the private and privileged methods; in the 'fully exposed object' pattern there is only one copy of each in memory.
- this pattern is hard to subclass; the new inherited class does not have access to the super class' private attributes or methods.

## More Advanced Patterns

### Static Methods and Attributes
Static members iteract with the class itself, whereas most methods and attributes interact with an instance of a class.

Here is the `Book` class with static attributes and methods:

```js
var Book = (function() {
  // Private static attributes.
  var numOfBooks = 0;

  // Private static method.
  function checkIsbn(isbn) {
    // ...
  }
  
  // Return the constructor
  return function(newIsbn, newTitle, newAuthor) { // Implements Publication
    
    // Private attributes.
    var isbn, title, author

    // Privileged methods.
    this.getIsbn = function () {
      return isbn;
    };
    this.setIsbn = function (newIsbn) {
      if(!checkIsbn(newIsbn)) throw new Error('Book: Invalid ISBN.')
      isbn = newIsbn;
    };

    this.getTitle = function() {
      return title;
    };
    this.setTitle = function(newTitle) {
      title = newTitle || 'No title specified';
    };

    this.getAuthor = function() {
      return author;
    };
    this.setAuthor = function(newAuthor) {
      author = newAuthor || 'No author specified';
    };

    // Constructor code.
    numOfBooks++; // Keep track of how many Books have been instantiated with the private static attribute.

    if(numOfBooks > 50) throw new Error('Book: Only 50 instances of Book can be created');

    this.setIsbn(newIsbn);
    this.setTitle(newTitle);
    this.setAuthor(newAuthor);
  }
})();

// Public static method
Book.convertToTitleCase = function(inputString) {
  // ...
};

// Public, non-privileged methods.
Book.prototype = {
  display: function() {
    // ...
  }
};
```
Because the private static methods are declared outside the constructor, they do not have access to the private attributes and are, therefore, not privileged. Private methods can call private static methods, but not the other way around.

A rule of thumb for deciding whether a private method should be static is to see whether it needs to access any of the instance data. It it does not need access, making the method static is more efficient (in terms of memory use) because only one copy is ever created.

`convertToTitleCase` is a public static method; it essentially uses the constructor as a name space. Public static methods could just as easily be separate functions, but it is useful to bundle tasks related to a class together, that are not related to any particular instance... Since they don't depend on any data from the instances.

Note:
Everything in JavaScript is an object. An object is essentially a hash table, so you can add members at any time.

### Constants
You can emulate constants in JavaScript by creating a private variable with an accessor but no mutator. Because consants are created at development time, and don't change with every new instance, it makes sense to create them as private static attributes. Here is how call a constant from the `UPPER_BOUND` from `Class`:

```js
Class.getUPPER_BOUND();
```

To implement this accessor, you would need a privileged static method, which we haven't covered yet. It is just like creating a privileged instance method, with the `this` keyword:

```js
var Class = (function() {
  // Constants (created as a private static attributes).
  var UPPER_BOUND = 100;

  // Privileged static method.
  this.getUPPER_BOUND() {
    return UPPER_BOUND;
  }

  // ...

  // Return the constructor
  return function(constructorArgument) {
    // ...
  }
})();
```

If you have a lot of constants, you can create a generic accessor (instead of one for each).

```js
var Class = (function() {
  // Private static attributes.
  var constants = {
    UPPER_BOUND: 100,
    LOWER_BOUND: -100
  }

  // ...

  // Return the constructor
  return function(constructorArgument) {
    // ...
  }
})();
```

You then call the single accessor:

```js
Class.getConstant('UPPER_BOUND');
```

### Singletons and Object Factories
The singleton pattern uses a returned object literal to expose privileged members, while keeping private members protected in the enclosing scope. It uses the same technique as in earlier sections, where an outer function is executed immediately and the result is assigned to a variable. Discussed further in Chapter 5.

An object factory is the same as a class constructor. Discussed further in Chapter 7.

## Benefits of Using Encapsulation
- protects the integrity of the internal data
- easier refactoring of your objects.
- private variables stops you from having to worry about namespace collisions
- only making methods public that are specified in the interface, you are promoting loosely coupled objects.

## Drawbacks of Encapsulation
- hard to unit test private methods; only test public methods.
- may make your classes too inflexible, if you don't have a clear understanding of how programmers will use them.
- it is hard to implement in JavaScript; it is important other programmers understand the pattern being used.

## Summary
- JavaScript has no built in way to enforce encapsulation; you rely on other techniques to achieve this.
- Creating true private members is only possible through closures.
- Creating a protected variable spaces allows you to implement public, private, and privileged members, as well as static class members and constants.

TODO: go over these patterns again and make sure you understand
