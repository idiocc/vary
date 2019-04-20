# @goa/vary

[![npm version](https://badge.fury.io/js/%40goa%2Fvary.svg)](https://npmjs.org/package/@goa/vary)

`@goa/vary` is a [fork](https://github.com/jshttp/vary) of Manipulate the HTTP Vary header rewritten in ES6 Modules.

```sh
yarn add @goa/vary
```

The original module has been updated to be used in [`@goa/koa`](https://artdecocode.com/goa/): _Koa_ web server compiled with _Google Closure Compiler_ using [**Depack**](https://artdecocode.com/depack/) into a single file library (0 dependencies).

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`vary(res: http.ServerResponse, field: string|Array<string>)`](#varyres-httpserverresponsefield-stringarraystring-void)
- [`append(header: string, field: string|Array<string>)`](#appendheader-stringfield-stringarraystring-void)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default and named functions:

```js
import vary, { append } from '@goa/vary'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `vary(`<br/>&nbsp;&nbsp;`res: http.ServerResponse,`<br/>&nbsp;&nbsp;`field: string|Array<string>,`<br/>`): void`

Adds the given header `field` to the _Vary_ response header of `res`. This can be a string of a single field, a string of a valid _Vary_ header, or an array of multiple fields.

This will append the header if not already listed, otherwise leaves it listed in the current location.

```js
/* alanode example/ */
import vary from '@goa/vary'
import aqt from '@rqt/aqt'
import { createServer } from 'http'

const server = createServer((req, res) => {
  // about to user-agent sniff
  vary(res, 'User-Agent')

  var ua = req.headers['user-agent'] || ''
  var isMobile = /mobi|android|touch|mini/i.test(ua)

  // serve site, depending on isMobile
  res.setHeader('Content-Type', 'text/html')
  res.end('You are (probably) ' + (isMobile ? '' : 'not ') + 'a mobile user')
})

server.listen(async () => {
  const url = `http://localhost:${server.address().port}`
  const { headers } = await aqt(url)
  console.log(headers)
  server.close()
})

// (async () => {
//   const res = await vary({
//     text: 'example',
//   })
//   console.log(res)
// })()
```
```
{ vary: 'User-Agent',
  'content-type': 'text/html',
  date: 'Sat, 20 Apr 2019 11:54:28 GMT',
  connection: 'close',
  'content-length': '36' }
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `append(`<br/>&nbsp;&nbsp;`header: string,`<br/>&nbsp;&nbsp;`field: string|Array<string>,`<br/>`): void`

Adds the given header `field` to the _Vary_ response header string `header`. This can be a string of a single field, a string of a valid _Vary_ header, or an array of multiple fields.

This will append the header if not already listed, otherwise leaves it listed in the current location. The new header string is returned.

```js

append('Accept, User-Agent', 'Origin')
```

```js
import { append } from '@goa/vary'

// Get header string appending "Origin" to "Accept, User-Agent"
console.log(append('Accept, User-Agent', 'Origin'))
console.log(append('Accept-Encoding, Accept', '*'))
console.log(append('Accept-Encoding, Accept, *', 'Origin'))
```
```
Accept, User-Agent, Origin
*
*
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>