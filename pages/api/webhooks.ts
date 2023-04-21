import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import client from "../../prisma/client"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']

  if (!sig) {
    return res.status(400).send({ message: "Missing the stripe signature" })
  }

  let event: Stripe.Event

  //Connect to Stripe Webhook and receiver order type event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!)
  } catch (e) {
    return res.status(400).send("Webhook error" + e)
  }

  //Handle different types of order events
  switch (event.type) {
    case "payment_intent.created":
      const paymentIntent = event.data.object
      console.log("Payment intent was created")
      break;
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge
      if (typeof charge.payment_intent === 'string') {
        const order = await client.order.update({
          where: { paymentIntentID: charge.payment_intent },
          data: { status: 'complete' }
        })
      }
      break;
    default: console.log("Unhandled event type: " + event.type)
  }
  res.json({ received: true })
}



