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
      },
      include: {
        TripNotes: {
          include: {
            TripNoteCosts: true,
            TripNoteItems: {
              include: {
                TripNoteItemImages: true
              }
            },
            User: true
          },
          orderBy: {
            title: "asc"
          }
        },
        User: true
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
