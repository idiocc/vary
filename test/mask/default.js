import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import vary from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults(input) {
    const res = await vary({
      text: input,
    })
    return res
  },
  context: Context,
})