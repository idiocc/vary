import { throws, equal } from 'assert'
import Server from '../context'
import { append } from '../../src'

export const args = {
  context: Server,
  header: {
    'is required'() {
      throws(append.bind(), /header.*required/)
    },
    'must be a string'() {
      throws(append.bind(null, 42), /header.*required/)
    },
  },
  field: {
    'is required'() {
      throws(append.bind(null, ''), /field.*required/)
    },
    'accepts strings'() {
      append('', 'foo')
    },
    'accepts string that is Vary header'() {
      append('', 'foo, bar')
    },
    'accepts array of string'() {
      append('', ['foo', 'bar'])
    },
    'does not allow separator ":"'() {
      throws(append.bind(null, '', 'invalid:header'), /field.*contains.*invalid/)
    },
    'does not allow separator " "'() {
      throws(append.bind(null, '', 'invalid header'), /field.*contains.*invalid/)
    },
    'does not allow non-token characters'() {
      throws(append.bind(null, '', 'invalid\nheader'), /field.*contains.*invalid/)
      throws(append.bind(null, '', 'invalid\u0080header'), /field.*contains.*invalid/)
    },
  },
}

export default {
  'when header is empty': {
    'sets value'() {
      equal(append('', 'Origin'), 'Origin')
    },
    'sets value with array'() {
      equal(append('', ['Origin', 'User-Agent']), 'Origin, User-Agent')
    },
    'preserves case'() {
      equal(append('', ['ORIGIN', 'user-agent', 'AccepT']), 'ORIGIN, user-agent, AccepT')
    },
  },
  'header has values': {
    'sets value'() {
      equal(append('Accept', 'Origin'), 'Accept, Origin')
    },
    'sets value with array'() {
      equal(append('Accept', ['Origin', 'User-Agent']), 'Accept, Origin, User-Agent')
    },
    'does not duplicate existing value'() {
      equal(append('Accept', 'Accept'), 'Accept')
    },
    'compares case-insensitive'() {
      equal(append('Accept', 'accEPT'), 'Accept')
    },
    'preserves case'() {
      equal(append('Accept', 'AccepT'), 'Accept')
    },
  },
  'when *': {
    'sets value'() {
      equal(append('', '*'), '*')
    },
    'act as if all values already set'() {
      equal(append('*', 'Origin'), '*')
    },
    'eradicates existing values'() {
      equal(append('Accept, Accept-Encoding', '*'), '*')
    },
    'updates bad existing header'(){
      equal(append('Accept, Accept-Encoding, *', 'Origin'), '*')
    },
  },
  'when field is string': {
    'sets value'() {
      equal(append('', 'Accept'), 'Accept')
    },
    'sets value when vary header'() {
      equal(append('', 'Accept, Accept-Encoding'), 'Accept, Accept-Encoding')
    },
    'acepts LWS'() {
      equal(append('', '  Accept     ,     Origin    '), 'Accept, Origin')
    },
    'handles contained *'() {
      equal(append('', 'Accept,*'), '*')
    },
  },
  'field is array': {
    'sets value'() {
      equal(append('', ['Accept', 'Accept-Language']), 'Accept, Accept-Language')
    },
    'ignores double-entries'() {
      equal(append('', ['Accept', 'Accept']), 'Accept')
    },
    'bes case-insensitive'() {
      equal(append('', ['Accept', 'ACCEPT']), 'Accept')
    },
    'handles contained *'() {
      equal(append('', ['Origin', 'User-Agent', '*', 'Accept']), '*')
    },
    'handles existing values'() {
      equal(append('Accept, Accept-Encoding', ['origin', 'accept', 'accept-charset']), 'Accept, Accept-Encoding, origin, accept-charset')
    },
  },
}