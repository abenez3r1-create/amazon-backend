const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "It's working",
  });
});
app.post("/payment/create", async (req, res) => {
  try {
    const total = Number(req.query.total);
    if (total && total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: "usd",
      });
      res.status(201).send({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(403).send({
        message: "Total must be greater than 0",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
