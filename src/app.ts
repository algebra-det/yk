import express from 'express'
import helmet from 'helmet'
import config from 'config'

import logger from './utils/logger'

import routes from './routes'
import errorHandler from './utils/errorHandler'
import ErrorResponse from './responses/ErrorResponse';

const port = config.get<number>('port')

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
  app.use('*', (_req, res) => {
    throw new ErrorResponse(404, 'No route found')
  })
  errorHandler(app)
})
