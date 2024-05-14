import { ClientOutput } from '../schema/client.schema'
import logger from '../utils/logger'
import client from './connect'

const getElasticObject = (data: ClientOutput) => {
  const indexData = {
    id: data.id,
    name: data.name,
    email: data.email,
    cin: data.cin
  }
  return indexData
}

export const addToElastic = async (data: ClientOutput) => {
  const indexData = getElasticObject(data)
  const res = await client.index({
    index: 'client',
    id: data.id.toString(),
    document: indexData
  })
  logger.info(`Added to Elastic: ${res._id}`)
  return res
}

export const updateInElastic = async (data: ClientOutput) => {
  const indexData = getElasticObject(data)
  const res = await client.update({
    index: 'client',
    id: data.id.toString(),
    doc: indexData
  })
  logger.info(`Updated in Elastic: ${res._id}`)
  return res
}

export const getMatchingFromElastic = async (str: string) => {
  const res = await client.search({
    index: 'client',
    query: {
      query_string: {
        query: str
      }
    }
  })
  return res
}

export const getSingleFromElastic = async (clientId: number) => {
  const id = clientId.toString()
  const res = await client.get({
    index: 'client',
    id
  })
  return res
}

export const deleteSingleFromElastic = async (clientId: number) => {
  const id = clientId.toString()
  const res = await client.delete({
    index: 'client',
    id
  })
  logger.info(`Deleted from Elastic: ${res._id}`)
}
