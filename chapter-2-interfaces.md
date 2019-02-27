"Program to an interface, not an implementation" - *Design Patterns* (Gang of Four)

## What is an Interface?
provides a way of specifying what methods an object should have


### Benefits of Using Interfaces
- Established interfaces are self-documenting and promote reusability
- Interfaces stabilize the way in which different classes communicate
- Testing and debugging become much easier because explicit errors with useful messages are given if an object does not have the expected type or does not implement the required methods

### Drawbacks of Using Interfaces
- Interfaces can partially enforce typing, reducing the flexibility of the language
- JavaScript does not come with inbuilt support for interfaces, so you are emulating Interface behaviour.
- You will take a small performance hit, due to the extra method invocation
- You cannot force other programmers to respect the interfaces you have created.


### How Other Object Oriented Languages Handle Interfaces

An interface from the `java.io` package:

```java
public interface DataOutput {
  void writeBoolean(boolean value) throws IOException;
  void writeByte(int value) throws IOException;
  void writeChar(int value) throws IOException;
  void writeShort(int value) throws IOException;
  void writeInt(int value) throws IOException;
  // ...
}
```
The above is a list of methods the class should implement.

Creating a class that uses this interface requires the `implements` keyword:

```java
public class DataOutputStream extends FilterOutputStream implements DataOutput {
  public final void writeBoolean (boolean, value) throws IOException {
    write (value ? 1 : 0)
  }
  // ...
}
```
Each method in the list is declared and concretely implemented. If any of the methods are not implements, an error displays at compile time. Below is an example of the error shown if an implementation error were to be found:

```java
MyClass should be declared abstract; it does not define writeBoolean(boolean) in MyClass
```

Here is another interface, written in PHP:

```php
interface MyInterface {
  public function interfaceMethod($argumentOne, $argumentTwo)
}

class MyClass implements MyInterface {
  public function interfaceMethod($argumentOne, $argumentTwo) {
    return $argumentOne . $argumentTwo;
  }
}

class BadClass implements MyInterface {
  //No Method Declarations
}

//BadClass causes this error at run-time:
//Fatal error: Class BadClass contains 1 abstract methods and must therefore be declared abstract (MyClass::interfaceMethod)
```

The same goes for C#

```csharp
interface MyInterface {
  public function interfaceMethod(string argumentOne, string argumentTwo)
}

class MyClass : MyInterface {
  public function interfaceMethod(string argumentOne, string argumentTwo) {
    return argumentOne argumentTwo;
  }
}

class BadClass : MyInterface {
  //No Method Declarations
}

//BadClass causes this error at compile-time:
//BadClass does not implement interface member MyInterface.interfaceMethod()
```

An interface structure holds information about what methods should be implemented and what arguments those methods have.

Each Class can implement more than one interface 

Errors are thrown if a method from an interface is not implemented; either at run-time or compile-time depending on the language.

JavaScript lacks the `interface` and `implements` keywords, as well as run-time checking for compliance. It is possible to emulate most of these features with a helper class and explicit compliance checking.

## Emulating an Interface in JavaScript

### Describing Interfaces with Comments

```js
// interface Composite {
//   function add(child);
//   function remove(child);
//   function getChild(child);
// }

// interface FormItem {
//   function save();
// }

var CompositeForm = function(id, method, action) {
  // implements Composite, FormItem
  // ...
};

// Implement the Composite interface.
CompositeForm.prototype.add = function(child) {
  // ...
};

CompositeForm.prototype.remove = function(child) {
  // ...
};

CompositeForm.prototype.getChild = function(child) {
  // ...
};

// Implement the FormItem interface
CompositeForm.prototype.save = function() {
  // ...
};
```

#### Drawbacks of the above approach:
- there is no checking to ensure CompositeForm actually does implement the correct set of methods. 
- No errors are thrown. 
- All compliance to the interface is voluntary.

#### Advantages:
- it's easy to implement
- it promotes re-usability
- it doesn't affect file size or execution speed
- the comments can be stripped out when the code is deployed; eliminating any increase in file size.


### Emulating Interfaces with Attribute Checking


```js
// interface Composite {
//   function add(child);
//   function remove(child);
//   function getChild(child);
// }

// interface FormItem {
//   function save();
// }

var CompositeForm = function(id, method, action) {
  this.implementsInterfaces = ['Composite', 'FormItem'];
  // ...
}

// ...

function addForm(formInstance) {
  if (!implements(formInstance, 'Composite', 'FormItem')) {
    throw new Error("Object does not implement a required interface.");
  }
  // ...
}

// The implements function, which checks to see if an object declares that it implements the required interface

function implements(object) {
  for(var i = 1; i < arguments.length; i++) {
    //Looping through all the arguments after the first one
    var interfaceName = arguments[i];
    var interfaceFound = false;
    for(var j = 0; j < object.implementsInterfaces.length; j++) {
      if(object.implementsInterfaces[j] === interfaceName) {
        interfaceFound = true;
        break;
      }
    }
    if(!interfaceFound) {
      return false; // An interface was not found
    }
  }
  return true; // All interfaces were found
}
```

#### Advantages:
- you document which interfaces a class implements
- you see errors if a class does not declare that it supports a required interface
- you can enforce that other programmers declare these interfaces through the use of these errors

#### Drawbacks:
- you are not ensuring the class really implements this interface
- easy to create a class that declares it implements an interface and then forget to add a method; checks will pass but the method will not be there, potentially causing problems in your code.
- It added work to explicitly declare the interfaces a class supports.

### Emulating Interfaces with Ducktyping
"If it walks like a duck, and quacks like a duck, it's a duck"

Premise: if an object contains methods that are named the same as the methods defined in your interface, it implements that interface.

```js
// Interfaces

var Composite = new Interface('Composite', ['add', 'remove', 'getChild']);

var FormItem = new Interface('FormItem', ['save']);

// CompositeForm Class

var CompositeFrom = function(id, method, action) {
  // ...
}

// ...

function addForm(formInstance) {
  ensuresImplements(formInstance, Composite, FormItem) {
    // This function will throw an error if a required method is not implemented
    // ...
  }
}
```

#### Drawbacks:
- a class never declares which interface it implements, reducing reusability and not self-documenting like other approaches
- it requires a helper class, `Interface`, and a helper function, `ensuresImplements`.
- it only check that the method has the correct name, not the names or numbers of arguments used in the methods or their types.


### The Interface Implemenation for this Book
This book uses a combination of the previous approaches

1. Comments to declare what interface a class supports (improving reusability and documentation)
2. The `Interface` helper
3. The class method `Interface.ensuresImplements` to perform explicit checking of methods
4. Useful error messages when objects don't pass the check.

Example:

```js
// Interfaces
var Composite = new Interface('Composite', ['add', 'remove', 'getChild']);

var FormItem = new Interface('FormItem', ['save']);

// CompositeForm class
var CompositeForm = function(id, method, action) {
  // implements Composite, FormItem
  // ...
};

// ...

function addForm(formInstance) {
  Interface.ensuresImplements(formInstance, Composite, FormItem );
  // This function will throw an error if a required method is not implemented, halting execution of the function. All code beneath this line will be executed only if the checks pass.
  // ...
}

```