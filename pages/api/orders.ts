import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import client from "../../prisma/client"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const user = await getServerSession(req, res, authOptions)
      if (!user) {
        res.status(403).json({ message: "Not logged in" })
      }
      const orders = await client.order.findMany({
        where: {
          userId: user?.user?.id
        },
        include: {
          product: true
        }
      })
      res.status(200).json(orders)
    } catch (e) {
      res.status(500).json({ message: "Fail to fetch orders" })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end("Methods not allowed")
  }
}
