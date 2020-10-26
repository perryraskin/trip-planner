import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { tripNote } = req.body
    const { userId, tripId, tripNoteType, tag, title, subtitle } = tripNote
    console.log(req.body)
    const tripNoteResponse = await prisma.tripNote.create({
      data: {
        User: {
          connect: {
            id: 1
          }
        },
        Trip: {
          connect: {
            id: tripId
          }
        },
        tripNoteType,
        tag,
        title,
        subtitle
      }
    })

    res.status(201)
    res.json({ tripNoteResponse })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
    console.log(err.message)
  } finally {
    await prisma.$disconnect()
  }
}
