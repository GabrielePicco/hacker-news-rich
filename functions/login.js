const axios = require('axios')

exports.handler = function instagram(event, context, callback) {
  const endpoint = 'https://news.ycombinator.com/login?goto=news'

  axios
    .get(endpoint)
    .then(({ data: { data: result } }) => {
    callback(null, {
    statusCode: 200,
      headers: {
      'content-type': 'text/html',
    },
    body: result,
  ),
  })
})
.catch((e) => {
    callback(e)
  })
}
