import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  //res = res as NextApiResponse
  //req = req as NextApiRequest
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { tripNoteItem } = req.body
    const { tripNoteId, title, subtitle, body } = tripNoteItem

    const tripNoteItemResponse = await prisma.tripNoteItem.create({
      data: {
        TripNote: {
          connect: {
            id: tripNoteId
          }
        },
        title,
        subtitle,
        body
      }
    })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
    console.log(err.message)
  } finally {
    await prisma.$disconnect()
  }
}
