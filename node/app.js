const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const stripe = require('stripe')(
  'sk_test_51HWcHnFFDcBiZd3lh2QfAg52Gw9gQcHbXGbyIx5F8EZEdsAFubhKSmkwdaLPhXm96uasMttm0lyyF6TxgwYZoWyW00geN5VUgf',
);

app.post('/api/doPayment/', (req, res) => {
  return stripe.charges
    .create({
      amount: req.body.amount, // Unit: cents
      currency: 'inr',
      source: req.body.tokenId,
      description: 'Test payment',
    })
    .then((result) => res.status(200).json(result));
});

app.listen(5000);
