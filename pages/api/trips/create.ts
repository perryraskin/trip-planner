import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req, res) {
  req = req as NextApiRequest
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { trip } = req.body
    const { nickname, dateStart, dateEnd } = trip
    console.log(req.body)
    const tripResponse = await prisma.trip.create({
      data: {
        User: {
          connect: {
            id: 1
          }
        },
        nickname,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd)
      }
    })

    res.status(201)
    res.json({ tripResponse })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
    console.log(err.message)
  } finally {
    await prisma.$disconnect()
  }
}
