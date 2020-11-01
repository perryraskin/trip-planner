import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const tripId = id as unknown
  const tripIdInt = tripId as string
  try {
    const { trip } = req.body
    console.log(req.body)
    // const deletedTrip = await prisma.trip.delete({
    //   where: { id: parseInt(tripIdInt) }
    // })
    const deletedTrip = await prisma.trip.update({
      where: { id: parseInt(tripIdInt) },
      data: {
        deleted: true
      }
    })

    res.status(201)
    res.json({ message: "Trip deleted", deletedTrip })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
