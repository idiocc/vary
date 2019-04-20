import { throws } from 'assert'
import Server from '../context'
import vary from '../../src'

/** @type {TestSuite} */
export const args = {
  context: Server,
  'res is required'() {
    throws(vary.bind(), /res.*required/)
  },
  'res does not allow non-res-like objects'() {
    throws(vary.bind(null, {}), /res.*required/)
  },
  async 'field is required'({ start, get, assert, callVary }) {
    await start(callVary())
    await get()
    assert(500, 'field argument is required')
  },
  async 'accepts string'({ start, get, assert, callVary }) {
    await start(callVary('foo'))
    await get()
    assert(200)
  },
  async 'accepts array of strings'({ start, get, assert, callVary }) {
    await start(callVary(['foo', 'bar']))
    await get()
    assert(200)
  },
  async 'accepts string that is Vary header'({ start, get, assert, callVary }) {
    await start(callVary('foo, bar'))
    await get()
    assert(200)
  },
  async 'does not allow separator ":"'({ start, get, assert, callVary }) {
    await start(callVary('invalid:header'))
    await get()
    assert(500, 'field argument contains an invalid header name')
  },
  async 'does not allow separator " "'({ start, get, assert, callVary }) {
    await start(callVary('invalid header'))
    await get()
    assert(500, 'field argument contains an invalid header name')
  },
}

/** @type {TestSuite} */
const noVary = {
  async 'sets value'({ start, callVary, get, assert }) {
    await start(callVary('Origin'))
    await get('/')
    assert('Vary', 'Origin')
    assert(200)
  },
  async 'sets value with multiple calls'({ start, callVary, get, assert }) {
    await start(callVary(['Origin', 'User-Agent']))
    await get('/')
    assert('Vary', 'Origin, User-Agent')
    assert(200)
  },
  async 'preserves case'({ start, callVary, get, assert }) {
    await start(callVary(['ORIGIN', 'user-agent', 'AccepT']))
    await get('/')
    assert('Vary', 'ORIGIN, user-agent, AccepT')
    assert(200)
  },
  async 'does not set Vary on empty array'({ start, callVary, get, assert }) {
    await start(callVary([]))
    await get('/')
    assert('Vary', null)
    assert(200)
  },
}
/** @type {TestSuite} */
const existingVary = {
  async 'sets value'({ start, alterVary, get, assert }) {
    await start(alterVary('Accept', 'Origin'))
    await get('/')
    assert('Vary', 'Accept, Origin')
    assert(200)
  },
  async 'sets value with multiple calls'({ start, get, assert }) {
    await start((req, res) => {
      res.setHeader('Vary', 'Accept')
      vary(res, 'Origin')
      vary(res, 'User-Agent')
    })
    await get('/')
    assert('Vary', 'Accept, Origin, User-Agent')
    assert(200)
  },
  async 'does not duplicate existing value'({ start, alterVary, get, assert }) {
    await start(alterVary('Accept', 'Accept'))
    await get('/')
    assert('Vary', 'Accept')
    assert(200)
  },
  async 'compares case-insensitive'({ start, alterVary, get, assert }) {
    await start(alterVary('Accept', 'accEPT'))
    await get('/')
    assert('Vary', 'Accept')
    assert(200)
  },
  async 'preserves case'({ start, alterVary, get, assert }) {
    await start(alterVary('AccepT', ['accEPT', 'ORIGIN']))
    await get('/')
    assert('Vary', 'AccepT, ORIGIN')
    assert(200)
  },
}

/** @type {TestSuite} */
const existingArray = {
  async 'sets value'({ start, alterVary, get, assert }) {
    await start(alterVary(['Accept', 'Accept-Encoding'], 'Origin'))
    await get('/')
    assert('Vary', 'Accept, Accept-Encoding, Origin')
    assert(200)
  },
  async 'does not duplicate existing value'({ start, alterVary, get, assert }) {
    await start(alterVary(['Accept', 'Accept-Encoding'], ['accept', 'origin']))
    await get('/')
    assert('Vary', 'Accept, Accept-Encoding, origin')
    assert(200)
  },
}

const T = {
  context: Server,
  'when no vary': noVary,
  'when existing Vary': existingVary,
  'when existing Vary as array': existingArray,
}

export default T

// describe('vary(res, field)', function () {

// describe('vary.append(header, field)', function () {
//   describe('arguments', function () {
//     describe('header', function () {
//       it('should be required', function () {
//         assert.throws(vary.append.bind(), /header.*required/)
//       })

//       it('should be a string', function () {
//         assert.throws(vary.append.bind(null, 42), /header.*required/)
//       })
//     })

//     describe('field', function () {
//       it('should be required', function () {
//         assert.throws(vary.append.bind(null, ''), /field.*required/)
//       })

//       it('should accept string', function () {
//         assert.doesNotThrow(vary.append.bind(null, '', 'foo'))
//       })

//       it('should accept string that is Vary header', function () {
//         assert.doesNotThrow(vary.append.bind(null, '', 'foo, bar'))
//       })

//       it('should accept array of string', function () {
//         assert.doesNotThrow(vary.append.bind(null, '', ['foo', 'bar']))
//       })

//       it('should not allow separator ":"', function () {
//         assert.throws(vary.append.bind(null, '', 'invalid:header'), /field.*contains.*invalid/)
//       })

//       it('should not allow separator " "', function () {
//         assert.throws(vary.append.bind(null, '', 'invalid header'), /field.*contains.*invalid/)
//       })

//       it('should not allow non-token characters', function () {
//         assert.throws(vary.append.bind(null, '', 'invalid\nheader'), /field.*contains.*invalid/)
//         assert.throws(vary.append.bind(null, '', 'invalid\u0080header'), /field.*contains.*invalid/)
//       })
//     })
//   })

//   describe('when header empty', function () {
//     it('should set value', function () {
//       assert.strictEqual(vary.append('', 'Origin'), 'Origin')
//     })

//     it('should set value with array', function () {
//       assert.strictEqual(vary.append('', ['Origin', 'User-Agent']), 'Origin, User-Agent')
//     })

//     it('should preserve case', function () {
//       assert.strictEqual(vary.append('', ['ORIGIN', 'user-agent', 'AccepT']), 'ORIGIN, user-agent, AccepT')
//     })
//   })

//   describe('when header has values', function () {
//     it('should set value', function () {
//       assert.strictEqual(vary.append('Accept', 'Origin'), 'Accept, Origin')
//     })

//     it('should set value with array', function () {
//       assert.strictEqual(vary.append('Accept', ['Origin', 'User-Agent']), 'Accept, Origin, User-Agent')
//     })

//     it('should not duplicate existing value', function () {
//       assert.strictEqual(vary.append('Accept', 'Accept'), 'Accept')
//     })

//     it('should compare case-insensitive', function () {
//       assert.strictEqual(vary.append('Accept', 'accEPT'), 'Accept')
//     })

//     it('should preserve case', function () {
//       assert.strictEqual(vary.append('Accept', 'AccepT'), 'Accept')
//     })
//   })

//   describe('when *', function () {
//     it('should set value', function () {
//       assert.strictEqual(vary.append('', '*'), '*')
//     })

//     it('should act as if all values already set', function () {
//       assert.strictEqual(vary.append('*', 'Origin'), '*')
//     })

//     it('should erradicate existing values', function () {
//       assert.strictEqual(vary.append('Accept, Accept-Encoding', '*'), '*')
//     })

//     it('should update bad existing header', function () {
//       assert.strictEqual(vary.append('Accept, Accept-Encoding, *', 'Origin'), '*')
//     })
//   })

//   describe('when field is string', function () {
//     it('should set value', function () {
//       assert.strictEqual(vary.append('', 'Accept'), 'Accept')
//     })

//     it('should set value when vary header', function () {
//       assert.strictEqual(vary.append('', 'Accept, Accept-Encoding'), 'Accept, Accept-Encoding')
//     })

//     it('should acept LWS', function () {
//       assert.strictEqual(vary.append('', '  Accept     ,     Origin    '), 'Accept, Origin')
//     })

//     it('should handle contained *', function () {
//       assert.strictEqual(vary.append('', 'Accept,*'), '*')
//     })
//   })

//   describe('when field is array', function () {
//     it('should set value', function () {
//       assert.strictEqual(vary.append('', ['Accept', 'Accept-Language']), 'Accept, Accept-Language')
//     })

//     it('should ignore double-entries', function () {
//       assert.strictEqual(vary.append('', ['Accept', 'Accept']), 'Accept')
//     })

//     it('should be case-insensitive', function () {
//       assert.strictEqual(vary.append('', ['Accept', 'ACCEPT']), 'Accept')
//     })

//     it('should handle contained *', function () {
//       assert.strictEqual(vary.append('', ['Origin', 'User-Agent', '*', 'Accept']), '*')
//     })

//     it('should handle existing values', function () {
//       assert.strictEqual(vary.append('Accept, Accept-Encoding', ['origin', 'accept', 'accept-charset']), 'Accept, Accept-Encoding, origin, accept-charset')
//     })
//   })
// })

/**
 * @typedef {(c: Server)} Test
 * @typedef {Object<string, Test>} TestSuite
 */