const axios = require('axios')
const qs = require('qs');

exports.handler = function(event, context, callback) {
  const endpoint = 'https://news.ycombinator.com/vote'

  const tryRequest = () => {
    return axios.post(endpoint, event.body)
  }

  const executeRequest = async () => {
    const request = tryRequest()
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

  executeRequest()

};
