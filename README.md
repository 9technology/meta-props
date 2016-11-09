# meta-props

[![Build Status](https://travis-ci.org/9technology/meta-props.svg?branch=master)](https://travis-ci.org/9technology/meta-props) [![Coverage Status](https://coveralls.io/repos/github/9technology/meta-props/badge.svg?branch=master)](https://coveralls.io/github/9technology/meta-props?branch=master)

Create key-valued hashes from a document's `meta` tags. Useful for reading static configurations from a page.

## Usage
---

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="foo" content="bar">
</head>
<body>
    <script>
        import metaProps from 'meta-props';
        const props = metaProps();
        console.assert(props.foo, 'bar');
    </script>
</body>
</html>
```

#### Objects

Properties can be also be deep using a separator, default `:` colon.

```html
<meta name="name:foo" content="foo">
<meta name="name:bar:baz" content="baz">
<script>
    const props = metaProps('name');
    console.assert(props.foo, 'foo');
    console.assert(props.bar.baz, 'baz');
</script>
```

#### Arrays

Naming the same `meta` tag will convert the values into an `Array`.

```html
<meta name="array" content="foo">
<meta name="array" content="bar">
<meta name="array" content="baz">
<script>
    const props = metaProps();
    console.assert(Array.isArray(props.array));
    console.log(props.array); // ['foo', 'bar', 'baz']
</script>
```

#### Casting Value Types

Values can also be type casted via the `type` attribute in the tag.

```html
<meta name="number" content="42" type="number">
<meta name="string" content="foo" type="string">
<meta name="boolean" content="true" type="boolean">
<meta name="json" content='{"foo":true}' type="json">
<meta name="empty"> <!-- no content or type -->
<script>
    const props = metaProps();
    console.log(typeof props.number);     // number
    console.log(typeof props.string);     // string
    console.log(typeof props.boolean);    // boolean
    console.log(typeof props.json);       // object
    console.log(typeof props.json.foo);   // boolean
    console.assert(props.empty === null);
</script>
```

## API
---

#### `metaProps([query=null, [separator=":"]])`
- `query` _String_ Used to select prefixed meta tag names.
- `separator` _String_ The split character for building deep hashes.

## License
---

[BSD-3-Clause](LICENSE)

Copyright (c) 2016 [9Technology](https://github.com/9technology)
