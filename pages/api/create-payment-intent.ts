import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import client from "../../prisma/client"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});

const calculateOrderAmount = (item: any) => {
  const totalPrice = item.reduce((acc: any, item: any) => {
    return acc + item.unit_amount! * item.quantity!
  }, 0)
  return totalPrice
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userSession = await getServerSession(req, res, authOptions);

  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" })
    return
  }

  const { items, payment_intent_id } = req.body

  const orderData = {
    user: {
      connect: {
        id: userSession.user?.id
      },
    },
    amount: calculateOrderAmount(items),
    currency: 'usd',
    status: 'pending',
    paymentIntentID: payment_intent_id,
    product: {
      create: items.map((item: any) => ({
        name: item.name,
        description: item.description || null,
        unit_amount: parseFloat(item.unit_amount),
        image: item.image,
        quantity: item.quantity
      }))
    }
  }

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)

    if (current_intent) {
      const update_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: calculateOrderAmount(items)
        }
      )

      const existing_order = await client.order.findFirst({
        where: {
          paymentIntentID: update_intent.id
        },
        include: {
          product: true
        }
      })

      if (!existing_order) {
        res.status(400).json({ message: "Invalid Payment Intent" })
      }

      const updated_order = await client.order.update({
        where: {
          id: existing_order?.id,
        }, data: {
          amount: calculateOrderAmount(items),
          product: {
            deleteMany: {},
            create: items.map((item: any) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: parseFloat(item.unit_amount),
              image: item.image,
              quantity: item.quantity
            }))
          }
        }
      })
      res.status(200).json({ paymentIntent: update_intent })
      return
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    })

    orderData.paymentIntentID = paymentIntent.id
    const newOrder = await client.order.create({
      data: orderData
    })
    res.status(200).json({ paymentIntent })
    return
  }

}


