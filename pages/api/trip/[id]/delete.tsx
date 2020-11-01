import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import auth from "../../../../middleware/auth"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const decodedToken = await auth(req, res)
  const prisma = new PrismaClient({ log: ["query"] })
  const {
    query: { id }
  } = req

  const tripId = id as unknown
  const tripIdInt = tripId as string
  try {
    const { trip } = req.body
    console.log(req.body)
    const currentTrip = await prisma.trip.findOne({
      where: {
        id: parseInt(tripIdInt)
      },
      include: {
        User: true
      }
    })

    if (currentTrip.User.featherId === decodedToken.sub) {
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
    } else {
      res.status(401)
      res.json({ error: "Not authorized" })
    }
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
