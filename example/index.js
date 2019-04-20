/* alanode example/ */
import vary from '../src'
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