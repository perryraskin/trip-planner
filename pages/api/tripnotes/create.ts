import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { parse } from "path"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { tripNote } = req.body
    const {
      userId,
      tripId,
      tripNoteType,
      tag,
      title,
      subtitle,
      priceUSD,
      pricePoints
    } = tripNote
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
        tripNoteType: parseInt(tripNoteType),
        tag,
        title,
        subtitle
      }
    })

    const tripNoteCostUSDResponse = await prisma.tripNoteCost.create({
      data: {
        TripNote: {
          connect: {
            id: tripNoteResponse.id
          }
        },
        amount: parseFloat(priceUSD),
        currency: "USD"
      }
    })

    const tripNoteCostPointsResponse = await prisma.tripNoteCost.create({
      data: {
        TripNote: {
          connect: {
            id: tripNoteResponse.id
          }
        },
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
    console.log(err.message)
  } finally {
    await prisma.$disconnect()
  }
}
