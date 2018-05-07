# srv-core
## Core functionality for server blueprint

Contains classes used by server:
- `Exception` class is an `Error` class with inner error
- `Middleware` class is a base class for binding middle-ware to [Express](https://expressjs.com/) application.
    - overwrite `bindToRouter()` to add functionality (body-parsers, filters, routes etc.) to provided application.
- ResourceFactory class is a base factory class for pooled resources. Implementations of this class used as factories for [generic-pool](https://github.com/coopernurse/node-pool).
    - overwrite `create()` method to create new resource
    - overwrite `destroy()` method to destroy resource
    - overwrite `validate()` method to test resource on borrowing
