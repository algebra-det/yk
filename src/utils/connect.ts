import { PrismaClient } from '@prisma/client'
import { baseBody } from '../schema/client.schema'

let db = new PrismaClient().$extends({
  query: {
    client: {
      create({ args, query }) {
        args.data = baseBody.body.parse(args.data)
        return query(args)
      },
      update({ args, query }) {
        args.data = baseBody.body.partial().parse(args.data)
        return query(args)
      }
    }
  }
})

export default db
