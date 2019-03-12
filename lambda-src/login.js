const axios = require('axios')
const qs = require('qs');

exports.handler = function(event, context, callback) {
  const endpoint = 'https://news.ycombinator.com/login'
  const params = qs.parse(event.body)

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const tryLogin = () => {
    if (params.creating != undefined) {
      pars = { 'acct': params.acct, 'pw': params.pw, 'goto': params.goto, 'creating': params.creating}
    } else {
      pars = { 'acct': params.acct, 'pw': params.pw, 'goto': params.goto}
    }
    return axios.post(endpoint, qs.stringify(pars))
  }

  const executeLogin = async () => {
    const login = tryLogin()
        .then(response => {
          callback(null, {
            statusCode: 200,
            body: response.data
          });
        })
        .catch(error => {
          console.log(error)
        })
  }

  executeLogin()

};
