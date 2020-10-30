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
    // const deletedTripNoteItem = await prisma.tripNote.delete({
    //   where: { id: parseInt(tripNoteItemIdInt) }
    // })
    const deletedTripNoteItem = await prisma.tripNoteItem.update({
      where: { id: parseInt(tripNoteItemIdInt) },
      data: {
        deleted: true
      }
    })

    res.status(201)
    res.json({ message: "Trip Note item deleted", deletedTripNoteItem })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
