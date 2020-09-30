const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const stripe = require('stripe')(
  'sk_test_51HWcHnFFDcBiZd3lh2QfAg52Gw9gQcHbXGbyIx5F8EZEdsAFubhKSmkwdaLPhXm96uasMttm0lyyF6TxgwYZoWyW00geN5VUgf',
);

exports.compltePaywithStripe = functions.https.onRequest(
  (request, response) => {
    stripe.charges
      .create({
        amount: request.body.amount,
        currency: request.body.currency,
        source: 'tok_mastercard',
      })
      .then((charge) => response.send(charge))
      .catch((err) => console.log(err));
  },
);
