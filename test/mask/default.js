import makeTestSuite from '@zoroaster/mask'
import Server from '../context'

export const call = makeTestSuite('test/result/call', {
  context: Server,
  /** @param {string} input */
  /** @param {Server} s */
  async getResults(input, { start, callVary, get, assert }) {
    await start(callVary(JSON.parse(input)))
    const { headers } = await get('/')
    assert(200)
    return headers['vary']
  },
  jsonProps: ['input'],
})
export const alter = makeTestSuite('test/result/alter', {
  context: Server,
  /** @param {string} input */
  /** @param {Server} s */
  async getResults(input, { start, alterVary, get, assert }) {
    await start(alterVary(JSON.parse(input), JSON.parse(this.vary)))
    const { headers } = await get('/')
    assert(200)
    return headers['vary']
  },
  jsonProps: ['input'],
})