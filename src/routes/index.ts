import { Express } from 'express'
import clientRoutes from './client.routes'

const routes = (app: Express) => {
  app.use('/', clientRoutes)
}

export default routes
