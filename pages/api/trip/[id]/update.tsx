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
    const { nickname, dateStart, dateEnd } = trip
    console.log(req.body)
    const tripResponse = await prisma.trip.update({
      where: { id: parseInt(tripIdInt) },
      data: {
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
  } finally {
    await prisma.$disconnect()
  }
}
