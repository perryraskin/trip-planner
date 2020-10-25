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
    const { tripNote } = req.body
    const { userId, tripId, tripNoteType, tag, title, subtitle } = tripNote
    console.log(req.body)
    const existingTrip = await prisma.tripNote.update({
      where: { id: parseInt(tripNoteIdInt) },
      data: {
        tripNoteType,
        tag,
        title,
        subtitle
      }
    })

    res.status(201)
    res.json({ tripNote })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
