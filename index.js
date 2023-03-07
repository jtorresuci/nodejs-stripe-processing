const express = require('express');
const app = express();

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
    apiVersion: '2020-08-27',
});

const cors = require('cors');
app.use(cors());

app.use(express.static('public'));
app.use(express.json());


app.post('/create-checkout-session', async (req, res) => {
  const { name, email, phone, dateTime, message, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          name: 'Deposit',
          description: 'Deposit for catering services',
          amount: 2000, // $20.00 in cents
          currency: 'usd',
          quantity: 1
        },
        {
          name: 'Service Fee',
          description: 'A service fee for the transaction',
          amount: 300, // $3.00 in cents
          currency: 'usd',
          quantity: 1
        }
      ]
      
,      
      customer_email: email,
      client_reference_id: name,
      mode: 'payment',
      success_url: `http://localhost:3000/success.html?name=${name}&email=${email}`,
      cancel_url: `http://localhost:3000/cancel.html?name=${name}&email=${email}`,
      metadata: {
        name,
        email,
        phone,
        dateTime,
        message,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
