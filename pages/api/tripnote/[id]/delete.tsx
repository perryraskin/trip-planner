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
    console.log(req.body)
    const deletedTripNote = await prisma.tripNote.delete({
      where: { id: parseInt(tripNoteIdInt) }
    })

    res.status(201)
    res.json({ message: "Trip Note deleted", deletedTripNote })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
