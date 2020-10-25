import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const tripNoteId = id as unknown
  const tripNoteIdInt = tripNoteId as string
  try {
    const tripNote = await prisma.tripNote.findOne({
      where: {
        id: parseInt(tripNoteIdInt)
      },
      include: {
        TripNoteCosts: true,
        TripNoteItems: {
          include: {
            TripNoteItemImages: true
          }
        }
      }
    })

    res.status(200)
    res.json({ tripNote })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
