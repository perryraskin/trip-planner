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
    const { nickname, dateStart, dateEnd } = trip
    console.log(req.body)
    const currentTrip = await prisma.trip.findOne({
      where: {
        id: parseInt(tripIdInt)
      },
      include: {
        User: true
      }
    })

    const user = await prisma.user.findOne({
      where: {
        id: currentTrip.userId
      }
    })

    if (user.featherId === decodedToken.sub) {
      const tripResponse = await prisma.trip.update({
        where: { id: parseInt(tripIdInt) },
        data: {
          nickname,
          dateStart: new Date(dateStart),
          dateEnd: new Date(dateEnd)
        }
      })

      res.status(201)
      res.json({ tripResponse })
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
