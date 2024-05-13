import express from 'express'
import helmet from 'helmet'
import 'dotenv/config'

import startCrawling from './crawler/fetchAndStore'
import logger from './utils/logger'

import routes from './routes'
import errorHandler from './utils/errorHandler'
import ErrorResponse from './responses/ErrorResponse'

const port = process.env.PORT

const app = express()

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
  // startCrawling()
  app.use('*', (_req, res) => {
    throw new ErrorResponse(404, 'No route found')
  })
  errorHandler(app)
})
