import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const { user } = req.body
    const newUser = await prisma.users.create({
      data: {
        name: user.name,
        email: user.email
      }
    })

    res.status(201)
    res.json({ user })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
