"Program to an interface, not an implementation" - *Design Patterns* (Gang of Four)

### What is an Interface?
provides a way of specifying what methods an object should have


#### Benefits of Using Interfaces
- Established interfaces are self-documenting and promote reusability
- Interfaces stabilize the way in which different classes communicate
- Testing and debugging become much easier because explicit errors with useful messages are given if an object does not have the expected type or does not implement the required methods

#### Drawbacks of Using Interfaces
- Interfaces can partially enforce typing, reducing the flexibility of the language
- JavaScript does not come with inbuilt support for interfaces, so you are emulating Interface behaviour.
- You will take a small performance hit, due to the extra method invocation
- You cannot force other programmers to respect the interfaces you have created.