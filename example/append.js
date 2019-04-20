import { append } from '../src'

// Get header string appending "Origin" to "Accept, User-Agent"
console.log(append('Accept, User-Agent', 'Origin'))
console.log(append('Accept-Encoding, Accept', '*'))
console.log(append('Accept-Encoding, Accept, *', 'Origin'))