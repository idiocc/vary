/* alanode example/ */
import vary from '../src'

(async () => {
  const res = await vary({
    text: 'example',
  })
  console.log(res)
})()