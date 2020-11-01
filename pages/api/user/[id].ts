import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const userId = id as unknown
  const userIdString = userId as string
  try {
    const user = await prisma.user.findOne({
      where: {
        featherId: userIdString
      },
      include: {
        Trips: {
          include: {
            TripNotes: {
              include: {
                TripNoteCosts: true,
                TripNoteItems: {
                  include: {
                    TripNoteItemImages: true
                  }
                }
              },
              orderBy: {
                title: "asc"
              }
            }
          }
        }
      }
    })

    res.status(200)
    res.json({ user })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
