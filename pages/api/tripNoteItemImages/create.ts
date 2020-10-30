import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  console.log(req.body)
  try {
    const { tripNoteItemImage } = req.body
    const { tripNoteItemId, name, sourceUrl } = tripNoteItemImage

    const tripNoteItemImageResponse = await prisma.tripNoteItemImage.create({
      data: {
        TripNoteItem: {
          connect: {
            id: parseInt(tripNoteItemId)
          }
        },
        name,
        tag: "",
        sourceUrl
      }
    })

    res.status(201)
    res.json({ tripNoteItemImageResponse })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
    console.log(err.message)
  } finally {
    await prisma.$disconnect()
  }
}
