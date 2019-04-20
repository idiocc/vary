## API

The package is available by importing its default and named functions:

```js
import vary, { append } from '@goa/vary'
```

%~%

```## vary
[
  ["res", "http.ServerResponse"],
  ["field", "string|Array<string>"]
]
```

Adds the given header `field` to the _Vary_ response header of `res`. This can be a string of a single field, a string of a valid _Vary_ header, or an array of multiple fields.

This will append the header if not already listed, otherwise leaves it listed in the current location.

%EXAMPLE: example, ../src => @goa/vary%
%FORK example%

%~%

```## append => string
[
  ["header", "string"],
  ["field", "string|Array<string>"]
]
```

Adds the given header `field` to the _Vary_ response header string `header`. This can be a string of a single field, a string of a valid _Vary_ header, or an array of multiple fields.

This will append the header if not already listed, otherwise leaves it listed in the current location. The new header string is returned.

```js

append('Accept, User-Agent', 'Origin')
```

%EXAMPLE: example/append, ../src => @goa/vary%
%FORK example/append%

%~%