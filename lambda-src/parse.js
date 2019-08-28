const Mercury = require('@postlight/mercury-parser');

exports.handler = (event, context, callback) => {

  Mercury.parse(event.queryStringParameters.url)
    .then(result => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result),
      });
    })
    .catch((err) => {
      callback(err);
    });
};
