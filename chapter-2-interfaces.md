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

