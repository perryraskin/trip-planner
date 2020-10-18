import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient({ log: ["query"] })

  try {
    const users = await prisma.users.findMany()

    res.status(200)
    res.json({ users })
  } catch (err) {
    res.status(500)
    res.json({ error: err.message })
  } finally {
    await prisma.$disconnect()
  }
}
