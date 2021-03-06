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
    const {
      userId,
      tripId,
      tripNoteType,
      tag,
      title,
      subtitle,
      priceUSDId,
      priceUSD,
      pricePointsId,
      pricePoints
    } = tripNote
    console.log(req.body)
    const tripNoteResponse = await prisma.tripNote.update({
      where: { id: parseInt(tripNoteIdInt) },
      data: {
        tripNoteType,
        tag,
        title,
        subtitle
      }
    })

    const tripNoteCostUSDResponse = await prisma.tripNoteCost.update({
      where: { id: parseInt(priceUSDId) },
      data: {
        amount: parseFloat(priceUSD),
        currency: "USD"
      }
    })

    const tripNoteCostPointsResponse = await prisma.tripNoteCost.update({
      where: { id: parseInt(pricePointsId) },
      data: {
        amount: parseFloat(pricePoints),
        currency: "points"
      }
    })

    res.status(201)
    res.json({
      tripNoteResponse,
      tripNoteCostUSDResponse,
      tripNoteCostPointsResponse
    })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
