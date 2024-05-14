import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import 'dotenv/config'

import startCrawling from './crawler/fetchAndStore'
import logger from './utils/logger'

import routes from './routes'
import errorHandler from './utils/errorHandler'
import ErrorResponse from './responses/ErrorResponse'

const port = process.env.PORT
const startCrawler = process.env.START_CRAWLER || false

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

process.on('SIGINT', async () => {
  try {
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})

app.listen(port, () => {
  logger.info(`Application listening at : http://localhost:${port}`)
  routes(app)
  if (startCrawler) startCrawling()
  app.use('*', (_req, res) => {
    throw new ErrorResponse(404, 'No route found')
  })
  errorHandler(app)
})
