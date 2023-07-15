# type-url

[![Actions Status](https://github.com/SUCHMOKUO/type-url/workflows/CI/badge.svg)](https://github.com/SUCHMOKUO/type-url/actions)
[![](https://img.shields.io/npm/v/type-url.svg)](https://www.npmjs.com/package/type-url)
![](https://img.shields.io/badge/dependencies-none-brightgreen.svg)
![](https://img.shields.io/npm/l/type-url.svg)

Make your URL type-safe by leveraging the power of TypeScript!

## Notification

1. TypeScript version need to be above `4.1.0`.

## Usage

Create the path object by passing in a object which represents your route tree recursively:

```typescript
import { createPath, END } from 'type-url';

const root = createPath({
  page1: {},
  page2: {
    [END]: true,
    subpage1: {}
  },
  page3: {
    subpage1: {}
  }
});
```

The example above creates a path object which can form the following urls:

- /page1
- /page2
- /page2/subpage1
- /page3/subpage1

You can use the `build` function from the library to get all the available urls:

```typescript
import { createPath, END, build } from 'type-url';

const root = createPath({
  page1: {},
  page2: {
    [END]: true,
    subpage1: {}
  },
  page3: {
    subpage1: {}
  }
});

build(root.page1); // => '/page1'
build(root.page2); // => '/page2'
build(root.page2.subpage1); // => '/page2/subpage1'
build(root.page3); // throws type error for unavailable url
build(root.page3.subpage1); // => '/page3/subpage1'
```

For url with path parameters, just name the path with prefix `':'`, for example:

```typescript
const root = createPath({
  users: {
    ':id': {}
  }
});
```

And the path object will automatically generate a value getter for that path as a function:

```typescript
const root = createPath({
  users: {
    ':id': {}
  }
});

build(root.users.id('123')); // => '/users/123'
```

If you don't pass in the value, the returned url will just keep the path parameter template there, this is useful when doing routing configurations using other libraries like react-router:

```typescript
build(root.users.id); // => '/users/:id'
```

A prefix for all the generated urls is possible, you can pass in your prefix as the second parameter of the `createPath` function:

```typescript
const root = createPath(
  {
    page1: {},
    page2: {}
  },
  '/the/prefix'
);

build(root.page1); // => '/the/prefix/page1'
build(root.page2); // => '/the/prefix/page2'
```
