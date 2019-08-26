const Mercury = require('@postlight/mercury-parser');

exports.handler = function(event, context, callback) {
  const params = qs.parse(event.body)

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const mercuryStory = async () => {
    Mercury.parse(url).then(response => {
      callback(null, {
      statusCode: 200,
        body: response
    }
  );
  })
  .catch(error => {
      console.log(error)
    })
  }

  mercuryStory()

};
