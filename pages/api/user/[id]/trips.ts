import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import auth from "../../../../middleware/auth"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const decodedToken = await auth(req, res)

  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const trips = await prisma.trip.findMany({
      where: {
        deleted: false,
        User: {
          featherId: decodedToken.sub
        }
      },
      orderBy: {
        dateStart: "asc"
      }
    })

    res.status(200)
    res.json({ trips })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
