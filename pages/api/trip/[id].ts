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
    const trip = await prisma.trips.findOne({
      where: {
        id: parseInt(tripIdInt)
      }
    })

    res.status(200)
    res.json({ trip })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
