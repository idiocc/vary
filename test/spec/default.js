import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import vary from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof vary, 'function')
  },
  async 'calls package without error'() {
    await vary()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await vary({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T