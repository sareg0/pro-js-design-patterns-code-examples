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

## Prototypal Inheritance

To learn prototypcal inheritance it is best to think only in terms of objects.

The classical approach to creating an object is:

- a) define the structure of the object, using a class declaration

- b) instantiate that class to create a new object.

Objects created in this manner:

- have their own copies of all instance attributes
- a link to a single the single copy of each of the instance methods.

In prototypal inheritance you simply create an object. This object is then reused by new objects and is called the _**prototype object**_ (written in italics to not be confused with the `prototype` object), because it provides a prototype for what the other objects should look like.

`Person`/`Author` using prototypal inhritance:

```js
/* Person Prototype Object */
var Person = {
  name: 'default name',
  getName: function() {
    return this.name;
  }
};
```

`Person` is now an object literal, and the _**prototype object**_ for other `Person`-like objects that you want to create.

Methods of the prototype will most likely never change, but the attributes almost certainly will:

```js
var reader = clone(Person);
alert(reader.getName()); // Output: 'default name'.
reader.name = 'John Smith';
alert(reader.getName()); // Output: 'John Smith'.
```

`clone` provides an empty object with the `prototype` attribute set to the _**prototype object**_. This means that if an attribute or method look up on the 'reader' object fails, it will look to the _**prototype object**_.

To create an `Author`, you make a clone of `Person`, instead of a subclass:

```js
/* Author Prototype Object */
var Author = clone(Person);
Author.books = []; // Default value.
Author.getBooks = function() {
  return this.books;
}
```

The methods and attributes of this clone of `Person` can now be overridden. You can change the default values give by `Person`, or add attributes and methods. This creates a new _**prototype object**_, which you can then clone to create `Author`-like objects:

```js
var author = [];

author[0] = clone(Author);
author[0].name = 'Dustin Diaz';
author[0].books = ['JavaScript Design Patterns'];

author[1] = clone(Author);
author[1].name = 'Ross Harmes';
author[1].books = ['JavaScript Design Patterns'];

author[1].getName();
author[1].getBooks();
```


### Asymmetrical Reading and Writing of Inherited Members
A clone is not a fully independent copy of its _**prototype object**_; it's a new empty object with its `prototype` attribute set to the _**prototype object**_.

`author[1].name` is actually a link back to the primitive `Person.name`. When you read the value `author[1].name` you are getting the linked value from the `prototype`, if you haven't defined the `name` attribute directly on the `author[1]` instance yet.  When you write to `author[1].name`, you are defining a new attribute directly on the `author[1]` object.

```js
var authorClone = clone(Author);
alert(authorClone.name) // Linked to the primative `Person.name`. Output: 'default name'.
authorClone.name = 'Becky Chambers' // A new primative is created and added to the authorClone itself.
alert(authorClone.name) // Now linked to the primative authorClone.name. Output: 'Ada Lovelace'.
authorClone.books.push('The Long Way to a Small Angry Planet')
// authorClone.books is linked to Author.books.
// The above modifies the prototype object's default value, and all other objects that inherit from `Author` will now have a new default value.
authorClone.books = []; // A new array is created and added to the authorClone object itself.
authorClone.book.push('A Closed and Common Orbit') // modifying that new array
```

One must create new copies of all arrays and objects before changing their members. It is easy to forget this and modify the value of the _**prototype object**_, but one must avoid this at all costs.

You can use the `hasOwnProperty` method to help distinguish between inherited members and the object's actual members.

Sometimes _**prototype objects**_ have child objects within them. To alter a single value within a child object, you have to recreate the entire thing. This would mean recreating it, and the cloned object would need to know about the structure and defaults for each child. In order to keep all objects as loosely coupled as possible, any complex child objects should be created using methods:

```js
var CompoundObject = {
  string1: 'default value',
  childObject: {
    bool: true,
    num: 10
  }
}

var compoundObjectClone = clone(CompoundObject);

// Bad! Changes the value of CompoundObject.childObject.num
compoundObjectClone.childObject.num = 5;

// Better. Creates a new object, but compoundObject must know the structure of that object, and the defaults.
// This makes CompoundObject and compoundObjectClone tightly coupled.

compoundObjectClone.childObject = {
  bool: true,
  num: 5
};

// Best approach.
// Uses a method to create a new object, with the same structure and defaults as the original.

var CompoundObject = {};
CompoundObject.string1 = 'default value';
CompoundObject.createChildObject = function() {
  return {
    bool: true,
    num: 10
  }
};

CompoundObject.childObject = CompoundObject.createChildObject();

var compoundObjectClone = clone(CompoundObject)
compoundObjectClone.childObject = CompoundObject.createChildObject();
compoundObjectClone.childObject.num = 5;
```


### The `clone` Function
```js
/* Clone Function  */
function clone(object) {
  function F() {};
  F.prototype = object;
  return new F;
}
```

The cloned object is completely empty, except for the `prototype` attribute, which is (indirectly) pointing to the _**prototype object**_.

## Comparing Classical and Prototypal Inheritance
Classical Inheritance is..
- more common, throughout other programming languages
-

Prototypal Inheritance is...
- memory efficient.
- unique to JavaScript

## Inheritance and Encapsulation
Fully exposed classes are the best candidates for subclassing; all members are public and will be passed on to the subclass. You can shield some methods using the underscore convention.

If a class with true private members is subclassed, priviledged methods will be passed on because they are publicly accessible. Private members can only be accessed via these privileged methods; new ones cannot be added to the subclass.

## Mixin Classes
Mixins classes are general classes that exist only to pass on their general methods to other classes.

```js
var Mixin = function() {
  Mixin.prototype = {
    serialize: function() {
      var output = [];
      for(key in this) {
        output.push(key + ': ' + this[key]);
      }
      return output.join(', ');
    }
  }
};
```
This sort of method could be useful to other classes, but you don't want them all inheriting from `Mixin`.

```js
augment(Author, Mixin);

var author = new Author('Ross Harmes', ['JavaScript Design Patterns']);
var serializedString = author.serialize();
```

In JavaScript the `prototype` attribute can only point to one object, meaning there can only be single inheritance. However, because a class _can_ be augmented by more than one mixin, this effectively is a way of achieving multiple inheritance.

The Augment function works like so:
1. walk through each member of the giving class's `prototype`, and add them to the receiving classes `prototype`.
2. If the member exists, skip it.

```js
/* Augment function */

function augment(receivingClass, givingClass) {
  for(methodName in givingClass.prototype) {
    if(!receivingClass.prototype[method_name]) {
      receivingClass.prototype[method_name] = givingClass.prototype[method_name]
    }
  }
}
```

An improved version, only copies methods with names matching the argument passed in:

```js
/* Augment function improved */

function augment(receivingClass, givingClass) {
  if(arguments[2]) { //Only given certain methods.
    for(var i =  02, len = arguments.length; i < len; i++) {
      receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]]
    }
  } else {
    for(methodName in givingClass.prototype) {
      if(!receivingClass.prototype[method_name]) {
        receivingClass.prototype[method_name] = givingClass.prototype[method_name]
      }
    }
  }
}
```
You can now write `augment(Author, Mixin, serialize)` to only augment `Author` with the `serialize` method.

Mixins are a lightweight way to avoid duplication, but they are not so oft-used.



## Example: Edit-in-Place
The task: write a modular, reusable API for creating and managing edit-in-place fields (a normal block of text in a webpage that, when clicked, turns into a form field and several buttons that allow that block of text to be edited). It should allow you to assign a unique ID to the object, give it a default value, and specify where in the page you want it to go.
It should also let you access the current value of the field at any time and have a couple of different options for the type of editing field used (e.g. a text area or an input text field).

### Using Classical Inheritance

First, create an API using classical inheritance:

```js
/* EditInPlaceField class. */
function EditInPlaceField(id, parent, value) {
  this.id = id;
  this.value = value || 'default value';
  this.parentElement = parent;

  this.createElements(this.id);
  this.attachEvents();
};

EditInPlaceField.prototype = {
  createElements: function(id) {
    this.containerElement = document.createElement('div');
    this.parentElement.appendchild(this.containerElement);

    this.staticElement = document.createElement('span');
    this.containerElement.appendChild(this.staticElement);
    this.staticElement.innerHTML = this.value;

    this.fieldElement = document.createElement('input');
    this.fieldElement.type = 'text';
    this.fieldElement.value = this.value;
    this.containerElement.appendChild(this.fieldElement);

    this.saveButton = document.createElement('input');
    this.saveButton.type = 'button';
    this.saveButton.value = 'Save';
    this.containerElement.appendChild(this.saveButton);

    this.cancelButton = document.createElement('input');
    this.cancelButton.type = 'button';
    this.cancelButton.value = 'Cancel';
    this.containerElement.appendChild(this.cancelButton);

    this.convertToText()
  },
  attachEvents: function() {
    var that = this;
    addEvent(this.staticElement, 'click', function() {
      that.convertToEditable();
    });
    addEvent(this.savebutton, 'click', function() {
      that.save();
    });
    addEvent(this.cancelButton, 'click', function() {
      that.cancel();
    });
  },

  convertToEditable: function() {
    this.staticElement.style.display = 'none';
    this.fieldElement.style.display = 'inline';
    this.savebutton.style.display = 'inline';
    this.cancelButton.style.display = 'inline';

    this.setValue(this.value);
  },
  save: function() {
    this.value = this.getValue();
    var that = this;
    var callback = {
      success: function() { that.convertToText(); },
      failure: function() { alert('Error saving value.'); }
    };
    ajaxRequest('GET', 'save.php?id=', + this.id + '&value=' + this.value, callback);
  },
  cancel: function() {
    this.convertToText();
  },
  convertToText: function() {
    this.fieldElement.style.display = 'none';
    this.savebutton.style.display = 'none';
    this.cancelButton.style.display = 'none';
    this.staticElement.style.display = 'inline';

    this.setValue(this.value);
  },
  setValue: function(value) {
    this.fieldElement.value = value;
    this.staticElement.innerHTML = value;
  },
  getValue: function() {
    return this.fieldElement.value;
  }
};
```

To create a field, instantiate the class:

```js
var titleClassical = new EditInPlaceField('titleClassical', $('doc'), 'Title Here');
var currentTitleText = titleClassical.getValue();
```

This creates an instance of `EditInPlaceField` class.
- text displayed in a `span` tag and a text input field used as the editing area.

It has configuration methods (`createElements`, `attachEvents`), a few internal methods for converting and saving (`convertToEditable`, `save`, `cancel`, `convertToText`), and an accessor and mutator pair (`getValue`, `setValue`).

Next create a class that uses a text area instead of a text input. Because `EditInPlaceField` and `EditInPlaceArea` are almost identical, create one as a subclass of the other, to avoid duplication:

```js
/* EditInPlaceArea class. */
function EditInPlaceArea(id, parent, value) {
  EditInPlaceArea.superclass.constructor.call(this, id, parent, value);
};
extend(EditInPlaceArea, EditInPlaceField);

// Override certain methods.
EditInPlaceArea.prototype.createElements = function(id) {
  this.containerElement = document.createElement('div');
  this.parentElement.appendChild(this.containerElement);

  this.staticElement = document.createElement('p');
  this.containerElement.appendChild(this.staticElement);
  this.staticElement.innerHTML = this.value;

  this.fieldElement = document.createElement('textarea');
  this.fieldElement.value = this.value;
  this.containerElement.appendChild(this.fieldElement);

  this.saveButton = document.createElement('input');
  this.saveButton.type = 'button';
  this.saveButton.value = 'Save';
  this.containerElement.appendChild(this.saveButton);

  this.cancelButton = document.createElement('input');
  this.cancelButton.type = 'button'
  this.cancelButton.value = 'Cancel';    this.containerElement.appendChild(this.cancelButton);

  this.convertToText();
};
EditInPlaceArea.prototype.convertToText = function() {
  this.fieldElement.style.display = 'none';
  this.saveButton.style.display = 'none';
  this.cancelButton.style.display = 'none';
  this.staticElement.style.display = 'block';

  this.setValue(this.value);
};
```

### Using Prototypal Inheritance
Although classical and prototypal inheritance are fundamentally different, repeating the exercise using prototypal inheritance really shows how similar the end code can be:

```js
/* EditInPlaceField object. */
var EditInPlaceField = {
  configure: function(id, parent, value) {
    this.id = id;
    this.value = value || 'default value';
    this.parentElement = parent;

    this.createElements(this.id);
    this.attacheEvents();
  },
  createElements: function(id) {
    this.containerElement = document.createElement('div');
    this.parentElement.appendChild(this.containerElement);
    this.staticElement = document.createElement('span');
    this.containerElement = appendChild(this.staticElement);
    this.staticElement.innerHTML = this.value;

    this.fieldElement = document.createElement('input');
    this.fieldElement.type = 'text';
    this.fieldElement.value = this.value;
    this.containerElement.appendChild(this.fieldElement);

    this.saveButton = document.createElement('input');
    this.saveButton.type = 'button';
    this.saveButton.value = 'Save';
    this.containerElement.appendChild(this.saveButton);

    this.cancelButton = document.createElement('input');
    this.cancelButton.type = 'button';
    this.cancelButton.value = 'Cancel';
    this.containerElement.appendChild(this.cancelButton);

    this.convertToText();
  },
  attachEvents: function() {
    var that = this;
    addEvent(this.staticElement, 'click', function() { this.convertToEditable(); });
    addEvent(this.saveButton, 'click', function() { that.save(); });
    addEvent(this.cancelButton, 'click', function() { that.cancel(); });
  },

  convertToEditable: function() {
    this.staticElement.style.display = 'none';
    this.fieldElement.style.display = 'inline';
    this.saveButton.style.display = 'inline';
    this.cancelButton.style.display = 'inline';

    this.setValue(this.value);
  },
  save: function() {
    this.value = this.getValue();
    var that = this;
    var callback = {
      success: function() { that.convertToText(); },
      failure: function() { alert('Error saving value'); }
    };
    ajaxRequest('GET', 'save.php?id=' + this.id + '&value=' + this.value, callback);
  },
  cancel: function() {
    this.convertToText();
  },
  convertToText: function() {
    this.fieldElement.style.display = 'none';
    this.saveButton.style.display = 'none';
    this.cancelButton.style.display = 'none';
    this.staticElement.style.display = 'inline';

    this.setValue(this.value);
  },

  setValue: function(value) {
    this.fieldElement.value = value;
    this.staticElement.innerHTML = value;
  },
  getValue: function() {
    return this.fieldElement.value;
  }
};
```

Instead of a class there is now an object. Prototypal inheritance doesn't use constructors, so you move that code into a `configure` method. Creating new object from this `EditInPlaceField` _prototype_ looks different to instantiating a class:

```js
var titlePrototypal = clone(EditInPlaceField);
titlePrototypal.configure(' titlePrototypal ', $('doc'), 'Title Here');
var currentTitleText = titlePrototypal.getValue();
```

Instead of using the `new` operator, use the `clone` function to create a copy. Then configure that copy. At this point interacting with `titlePrototypal` and `titleClassical` becomes almost indistinguishable because they use the same API.

Creating a child also uses the clone function:

```js
/* EditInPlaceArea object. */
var EditInPlaceArea = clone(EditInPlaceField);

// Override certain methods.
EditInPlaceArea.createElements = function(id) {
  this.containerElement = document.createElement('div');
  this.parentElement.appendChild(this.containerElement);

  this.staticElement = document.createElement('p');
  this.containerElement.appendChild(this.staticElement);
  this.staticElement.innerHTML = this.value;

  this.fieldElement = document.createElement('textarea');
  this.fieldElement.value = this.value;
  this.containerElement.appendChild(this.fieldElement);

  this.saveButton = document.createElement('input');
  this.saveButton.type = 'button';
  this.saveButton.value = 'Cancel';
  this.containerElement.appendChild(this.cancelButton);

  this.convertToText();
};
EditInPlaceArea.convertToEditable = function() {
  this.staticElement.style.display = 'none';
  this.fieldElement.style.display = 'block';
  this.saveButton.style.display = 'inline';
  this.cancelButton.style.display = 'inline';

  this.setValue(this.value);
};
EditInPlaceArea.convertToText = function() {
  this.fieldElement.style.display = 'none';
  this.saveButton.style.display = 'none';
  this.cancelButton.style.display = 'innoneline';
  this.staticElement.style.display = 'block';

  this.setValue(this.value);
};
```

The only differences between the prototypal and classical examples is how the class/object is setup and the way a sub-object/instance is created.
The similarity of the classical and prototypal examples illustrates how easy it is to switch from one paradigm to the other.

Prototypal inheritance in this example doesn't really provide anything over classical inheritance. The objects do not use many default values, so you aren't really saving any memory; both paradigms work equally well for this example.

### Using Mixin Classes

We will now create one mixin class with all of the methods we want to share. Then we will create a new class and use augment to share those methods.

```js
/* Mixin class for the edit-in-place methods. */
var EditInPlaceMixin = function() {};
EditInPlaceMixin.prototype = {
  createElements: function (id) {
    this.containerElement = document.createElement('div');
    this.parentElement.appendChild(this.containerElement);

    this.staticElement = document.createElement('span');
    this.containerElement = appendChild(this.staticElement);
    this.staticElement.innerHTML = this.value;

    this.fieldElement = document.createElement('span');
    this.fieldElement.type = 'text';
    this.fieldElement.value = this.value;
    this.containerElement.appendChild(this.fieldElement);

    this.saveButton = document.createElement('input');
    this.saveButton.type = 'button';
    this.saveButton.value = 'save';
    this.containerElement.appendchild(this.saveButton);

    this.cancelButton = document.createElement('input');
    this.cancelButton.type = 'button';
    this.cancelButton.value = 'Cancel';
    this.containerElement.appendChild(this.cancelButton);

    this.convertToText();
  },
  attachEvents: function() {
    var that = this;
    addEvent(this.staticElement, 'click', function() { that.convertToEditable(); })
    addEvent(this.saveButton, 'click' function() { that.save(); });
    addEvent(this.cancelButton, 'click', function() { that.cancel(); });
  },
  convertToEditable: function() {
    this.staticElement.style.display = 'none';
    this.fieldElement.style.display = 'inline';
    this.saveButton.style.display = 'inline';
    this.cancelButton.style.display = 'inline';

    this.setValue(this.value);
  },
  save: function() {
    this.value = this.getValue();
    var that = this;
    var callback = {
      success: function() { that.convertToText(); },
      failure: function() { alert('Error saving value.') }
    };
    ajaxRequest('GET', 'save.php?id=' + this.id + '&value=' + this.value, callback);
  },
  cancel: function() {
    this.convertToText();
  },
  convertToText: function() {
    this.fieldElement.style.display = 'none';
    this.saveButton.style.display = 'none';
    this.cancelButton.style.display = 'none';
    this.staticElement.style.display = 'inline';

    this.setValue(this.value);
  },
  setValue: function(value) {
    this.fieldElement.value = value;
    this.staticElement.innerHTML = value;
  },
  getValue: function() {
    return this.fieldElement.value;
  }
};
```

The mixin class holds nothing but the methods. To create a functional class, make a constructor and then call `augment`:

```js
/* EditInPlaceField class. */
function EditInPlaceField(id, parent, value) {
  this.id = id;
  this.value = value;
  this.parentElement = parent;

  this.createElements(this.id);
  this.attachEvents();
};
augment(EditInPlaceField, EditInPlaceMixin);
```

You can now instantiate the class in the exact same way as with classical inheritance. To create the class that uses a text field, you will not sublcass `EditInPlaceField`. Instead, simply create a new class (with a constructor) and augment it from the same mixin class. But before augmenting it, define a few methods. Since these are in place before augmenting it, they will not get overwritten.

```js
/* EditInPlaceArea class. */
function EditInPlaceArea(id, parent, value) {
  this.id = id;
  this.value = value || 'default value';
  this.parentElement = parent;

  this.createElements(this.id);
  this.attachEvents();
};

// Add certain methods so that augment won't include them.
EditInPlaceArea.prototype.createElements = function(id) {
  this.containerElement = document.createElement('div');
  this.parentElement.appendChild(this.containerElement);

  this.staticElement = document.createElement('p');
  this.containerElement.appendChild(this.staticElement);
  this.staticElement.innerHTML = this.value;

  this.fieldElement = document.createElement('textarea');
  this.fieldElement.value = this.value;
  this.containerElement.appendChild(this.fieldElement);

  this.saveButton = document.createElement('input');
  this.saveButton.type = 'button';
  this.saveButton.value = 'Save';
  this.containerElement.appendChild(this.saveButton);

  this.cancelButton = document.createElement('input');
  this.cancelButton.type = 'button';
  this.cancelButton.value = 'Cancel';
  this.containerElement.appendChild(this.cancelButton);

  this.convertToText();
};
EditInPlaceArea.prototype.convertToText = function() {
  this.fieldElement.style.display = 'none';
  this.saveButton.style.display = 'none';
  this.cancelButton.style.display = 'none';
  this.staticElement.style.display = 'none';

  this.setValue(this.value);
};

augment(EditInPlaceArea, EditInPlaceMixin);
```

Mixin classes are good for sharing general purpose methods with disparate classes. For the examples, the mixin solution doesn't make much sense; because it is used to provide all the methods for two very similar classes

## When Should Inheritance Be Used?
Simple programs rarely require abstracting a class.
Only use inheritance if the benefit of re-use and organisation, outweighs the added complexity.

Prototypal inheritance (with the `clone` function) is best used in situations where memory efficiency is important.

Classical Inheritance (with the `extend` function) is best used in when the programmers dealing with the objects are fmiliar with how inheritance works in other object-oriented languages.

Both classical and prototypal inheritance are well suited for class heirarchies when the differences between each class are slight. If classes are very different from each other, it usually makes more sense to augment them with methods from mixin classes.

## Summary
Classical inheritance emulates the way classes inherit from each other in other object oriented languages such as C++ and Java. It is suited for situations when memory efficiency is not an issues, or programmers are not familiar with prototypal inheritance. Confusion surrounding subclassing can be reduced using the `extend` function.

Prototypal inheritance works by creating objects and then cloning them. The objects it creates tend to be memory efficient, due to the fact that attributes and methods are shared until they are overwritten. There can be confusion surrounding cloned objects that contain arrays or objects as attributes. The `clone` function takes care of all the steps in creating a cloned object.

Mixin classes provide a way to have objects and classes share methods without being in a parent-child relationship. It should be used where you have general-purpose methods that you want to share to dissimilar classes. It is possible to share all of the methods in a mixin class, or just a few of them, using the `augment` function.

Using these three techniques it is possible to create complex object heirarchies that rival any other object oriented language in its elegance.

Inheritance in JavaScript is:

- not obvious or intuitive to the novice programmer.
- an advanced technique that benefits from low-level study of the language
- can be made more simple through convenience functions
- ideal for creating APIs for other programmers to use.
