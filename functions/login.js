const axios = require('axios');

const LOGIN_ENDPOINT = "https://news.ycombinator.com/login";

exports.handler = async (event, context) => {
  const endpoint = 'https://api.instagram.com/v1/users/self/media/recent'
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const limit = 5

  axios
    .get('LOGIN_ENDPOINT')
    .then(({ data: { data: res } }) => {
    callback(null, {
    statusCode: 200,
      headers: {
      'content-type': 'text/html',
    },
    body: res,
  })
})
.catch((e) => {
    callback(e);
  })
};
