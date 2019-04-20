import { equal } from 'assert'
import { createServer } from 'http'
import aqt from '@rqt/aqt'
import vary from '../../src'

export default class Server {
  /**
   * Creates a server.
   */
  async start(fn) {
    const server = createServer((req, res) => {
      try {
        fn(req, res)
        res.statusCode = 200
      } catch (err) {
        res.statusCode = 500
        res.write(err.message)
      } finally {
        res.end()
      }
    })
    await new Promise((r) => {
      server.listen(r)
    })
    this.server = server
    this.url = `http://0.0.0.0:${server.address().port}`
  }
  callVary(field) {
    return function call(req, res) {
      vary(res, field)
    }
  }
  alterVary(header, field) {
    return function call (req, res) {
      res.setHeader('Vary', header)
      vary(res, field)
    }
  }
  async get(path = '') {
    const { statusCode, body, headers } = await aqt(`${this.url}${path}`)
    this.statusCode = statusCode
    this.body = body
    this.headers = headers
    return { statusCode, body, headers }
  }
  assert(code, message) {
    if (typeof code == 'string' && message) {
      equal(this.headers[code.toLowerCase()], message)
      return
    } else if (typeof code == 'string' && message === null) {
      const v = this.headers[code.toLowerCase()]
      if (v)
        throw new Error(`The response had header ${code}: ${v}`)
      return
    }
    equal(this.statusCode, code)
    if (message) equal(this.body, message)
  }
  _destroy() {
    if (this.server) this.server.close()
  }
}