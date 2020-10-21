import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const tripId = id as unknown
  const tripIdInt = tripId as string
  try {
    const { trip } = req.body
    console.log(req.body)
    const existingTrip = await prisma.trips.update({
      where: { id: parseInt(tripIdInt) },
      data: {
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
  } finally {
    await prisma.$disconnect()
  }
}
