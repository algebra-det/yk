import ErrorResponse from '../responses/ErrorResponse'
import { ClientInput, UpdateInput } from '../schema/client.schema'
import db from '../utils/connect'

const getQueryArgs = (q: string) => {
  const query: Record<string, any> = {}
  const parsed = parseInt(q) || q.toLocaleLowerCase()
  console.log('Parsed: ', parsed)

  if (typeof parsed === 'string') {
    query.where = {
      OR: [
        { name: { contains: parsed } },
        { cin: { contains: parsed } },
        { email: { contains: parsed } }
      ]
    }
  } else
    query.where = {
      id: parsed
    }
  return query
}

export const getTotalCount = async (q: string = '') => {
  const args = {}
  if (q) Object.assign(args, getQueryArgs(q))
  return db.client.count(args)
}

export const getAllClient = async (
  limit: number,
  offset: number,
  q: string = ''
) => {
  const args = {
    skip: offset,
    take: limit
  }
  if (q) {
    const query = getQueryArgs(q)
    Object.assign(args, query)
  }

  return db.client.findMany(args)
}

export const getSingleClient = async (id: number) => {
  return db.client.findUnique({ where: { id } })
}

export const isAlreadyPresent = async (input: UpdateInput['body']) => {
  const alreadyPresent = await db.client.findFirst({
    where: {
      OR: [
        {
          name: input.name
        },
        {
          cin: input.cin
        }
      ]
    }
  })
  return Boolean(alreadyPresent)
}

export const createClient = async (input: ClientInput['body']) => {
  const alreadyPresent = await isAlreadyPresent(input)
  if (alreadyPresent)
    throw new ErrorResponse(400, 'Client with details already available')
  return await db.client.create({ data: input })
}

export const updateClient = async (id: number, input: UpdateInput['body']) => {
  if (Object.keys(input).length)
    return await db.client.update({ where: { id: id }, data: { ...input } })
  return updateClient
}

export const deleteClient = async (id: number) => {
  return db.client.delete({ where: { id: id } })
}
