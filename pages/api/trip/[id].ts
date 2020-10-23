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
    const trip = await prisma.trip.findOne({
      where: {
        id: parseInt(tripIdInt)
      }
    })

    const tripNotes = await prisma.tripNote.findMany({
      where: {
        tripId: trip.id
      }
    })

    res.status(200)
    res.json({ trip, tripNotes })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
