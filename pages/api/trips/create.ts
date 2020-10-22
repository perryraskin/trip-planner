import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { trip } = req.body
    console.log(req.body)
    const newTrip = await prisma.trip.create({
      data: {
        User: {
          connect: {
            id: 1
          }
        },
        nickname: trip.nickname,
        dateStart: new Date(trip.dateStart),
        dateEnd: new Date(trip.dateEnd)
      }
    })

    res.status(201)
    res.json({ trip })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
    console.log(err.message)
  } finally {
    await prisma.$disconnect()
  }
}
