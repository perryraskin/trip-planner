import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const tripNoteItemId = id as unknown
  const tripNoteItemIdInt = tripNoteItemId as string
  try {
    const { tripNoteItem } = req.body
    const { tripNoteId, title, subtitle, body } = tripNoteItem
    console.log(req.body)
    const tripNoteItemResponse = await prisma.tripNoteItem.update({
      where: { id: parseInt(tripNoteItemIdInt) },
      data: {
        title,
        subtitle,
        body
      }
    })

    res.status(201)
    res.json({ message: "Trip Note item updated", tripNoteItemResponse })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
