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
