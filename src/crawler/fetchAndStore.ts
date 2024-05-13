import { JSDOM } from 'jsdom'
import db from '../utils/connect'
import {
  basicIndexToKey,
  statusIndexToKey,
  financialIndexToKey,
  contactIndexToKey,
  KeyValue
} from './constants'
import { ClientInput, baseBody } from '../schema/client.schema'
import logger from '../utils/logger'

const CHUNK_SIZE_OF_DB_CREATE = 5

const fetchHTMLResponse = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }

  const htmlText = await response.text()
  return htmlText
}

const getKeyValuesViaSelector = (
  document: any,
  selector: string,
  objectIndexToCheck: KeyValue
) => {
  const data: Record<string, string | number> = {}
  const query = document.querySelectorAll(selector)
  if (query) {
    query.forEach((el: any, idx: number) => {
      const key = objectIndexToCheck[idx]
      if (key) {
        let text =
          el.lastElementChild.lastElementChild.lastElementChild.innerHTML

        if (key.name === 'state')
          text =
            el.lastElementChild.lastElementChild.lastElementChild
              .lastElementChild?.innerHTML
        if (text)
          data[objectIndexToCheck[idx].name] = convertValueType(key.type, text)
      }
    })
  }
  return data
}

const startCrawling = async () => {
  // await db.client.deleteMany({ where: {} })
  const baseUrl = 'https://www.companydetails.in'
  const url = `${baseUrl}/latest-registered-company-mca`

  const htmlResponse = await fetchHTMLResponse(url)
  const dom = new JSDOM(htmlResponse)

  const linkList: string[] = []

  if (dom) {
    const document = dom.window.document
    const query = document.querySelectorAll('.fs-6.text-uppercase')
    if (query) {
      query.forEach((q: any) => {
        if (q.attributes.href.value) {
          const link = baseUrl + q.attributes.href.value
          linkList.push(link)
        }
      })
    }
  }
  console.log(linkList)
  if (linkList.length) getAndSaveEachClient(linkList)
}

const convertValueType = (
  type: 'date' | 'number' | 'string',
  value: string
) => {
  if (type === 'date')
    return new Date(value).toISOString().split('T')[0].toString()
  if (type === 'number') return parseInt(value)
  return value
}

const getAndSaveEachClient = async (links: string[] = []) => {
  let totalSaved = 0
  let totalLost = 0
  let parsedListData: ClientInput['body'][] = []
  for (let index = 0; index < links.length; index++) {
    const link = links[index]
    try {
      const resHTML = await fetchHTMLResponse(link)

      const dom = new JSDOM(resHTML)

      if (dom) {
        const document = dom.window.document
        const clientData: Record<string, unknown> = { link }

        // Getting Basic Details
        const basic = getKeyValuesViaSelector(
          document,
          '#basicdetails > div.bg-white.justify-content-between',
          basicIndexToKey
        )
        Object.assign(clientData, basic)

        // Company Status
        const status = getKeyValuesViaSelector(
          document,
          '#COMPANY-STATUS > div.bg-white.justify-content-between',
          statusIndexToKey
        )
        Object.assign(clientData, status)

        // Financial Details
        const financial = getKeyValuesViaSelector(
          document,
          '#FINANCIAL-DETAILS > div.bg-white.justify-content-between',
          financialIndexToKey
        )
        Object.assign(clientData, financial)

        // Contact Details
        const contact = getKeyValuesViaSelector(
          document,
          '#CONTACT-DETAILS > div.bg-white.justify-content-between',
          contactIndexToKey
        )
        Object.assign(clientData, contact)
        console.log('getting parsed data: ', clientData.link)
        const parsed = await getParsedData(clientData as ClientInput)
        if (parsed) parsedListData.push(parsed)
      }
    } catch (error) {
      console.log('Failed to Add: ', link, error)
    }
    if (parsedListData.length >= CHUNK_SIZE_OF_DB_CREATE) {
      const { saved, lost } = await saveListToDB(parsedListData)
      totalSaved += saved
      totalLost += lost
      parsedListData = []
      logger.info(`TOTAL SAVED: ${totalSaved}`)
      if (totalLost) logger.error(`TOTAL LOST/DUPLICATES: ${totalLost}`)
    }
  }
  if (parsedListData.length) saveListToDB(parsedListData)
}

const saveListToDB = async (data: ClientInput['body'][]) => {
  const res = await db.client.createMany({
    data,
    skipDuplicates: true
  })
  const totalLost = data.length - res.count
  if (totalLost) logger.info(`LOST/DUPLICATES: ${totalLost}`)
  return { saved: res.count, lost: totalLost }
}

const getParsedData = async (clientData: ClientInput) => {
  try {
    return baseBody.body.parse(clientData)
  } catch (error) {
    return null
  }
}

export default startCrawling
