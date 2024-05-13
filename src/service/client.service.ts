import ErrorResponse from '../responses/ErrorResponse'
import { ClientInput, UpdateInput } from '../schema/client.schema'
import db from '../utils/connect'

export const getAllClient = async () => {
  return db.client.findMany({})
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
