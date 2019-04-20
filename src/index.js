/*!
 * vary
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * RegExp to match field-name in RFC 7230 sec 3.2
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 */

const FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/

/**
 * Append a field to a vary header.
 * @param {string} header
 * @param {string|!Array<string>} field
 */
export function append(header, field) {
  if (typeof header != 'string')
    throw new TypeError('header argument is required')

  if (!field)
    throw new TypeError('field argument is required')

  // get fields array
  const fields = !Array.isArray(field) ? parse(`${field}`) : field

  // assert on invalid field names
  for (let j = 0; j < fields.length; j++) {
    if (!FIELD_NAME_REGEXP.test(fields[j])) {
      throw new TypeError('field argument contains an invalid header name')
    }
  }

  // existing, unspecified vary
  if (header == '*') return header

  // enumerate current values
  var val = header
  const vals = parse(header.toLowerCase())

  // unspecified vary
  if (fields.includes('*') || vals.includes('*'))
    return '*'

  for (let i = 0; i < fields.length; i++) {
    const fld = fields[i].toLowerCase()

    // append value (case-preserving)
    if (!vals.includes(fld)) {
      vals.push(fld)
      val = val
        ? val + ', ' + fields[i]
        : fields[i]
    }
  }

  return val
}

/**
 * Parse a vary header into an array.
 * @param {string} header
 */
function parse(header) {
  var end = 0
  var list = []
  var start = 0

  // gather tokens
  for (var i = 0, len = header.length; i < len; i++) {
    switch (header.charCodeAt(i)) {
    case 0x20: /*   */
      if (start == end) {
        start = end = i + 1
      }
      break
    case 0x2c: /* , */
      list.push(header.substring(start, end))
      start = end = i + 1
      break
    default:
      end = i + 1
      break
    }
  }

  // final token
  list.push(header.substring(start, end))

  return list
}

/**
 * Mark that a request is varied on a header field.
 *
 * @param {http.ServerResponse} res
 * @param {string|!Array<string>} field
 */
export default function vary(res, field) {
  if (!res || !res.getHeader || !res.setHeader) {
    // quack quack
    throw new TypeError('res argument is required')
  }

  // get existing header
  let val = res.getHeader('Vary') || ''
  const header = Array.isArray(val)
    ? val.join(', ')
    : `${val}`

  // set new header
  if ((val = append(header, field))) {
    res.setHeader('Vary', val)
  }
}

/* typal types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').ServerResponse} http.ServerResponse
 */
