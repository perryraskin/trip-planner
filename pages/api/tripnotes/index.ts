import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const { userId, tripId } = req.query

  let filters = {}
  if (userId && tripId) {
    filters = {
      deleted: false,
      userId,
      tripId
    }
  } else if (userId && !tripId) {
    filters = {
      deleted: false,
      userId
    }
  } else if (!userId && tripId) {
    filters = {
      deleted: false,
      tripId
    }
  }

  try {
    const tripnotes = await prisma.tripNote.findMany({
      where: filters
    })

    res.status(200)
    res.json({ tripnotes })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
