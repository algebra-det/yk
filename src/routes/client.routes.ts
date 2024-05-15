import express from 'express'
import {
  createClientHandler,
  deleteClientHandler,
  getAllClientHandler,
  getSingleClientHandler,
  updateClientHandler
} from '../controller/client.controller'
import validateResource from '../middleware/validateResource'
import {
  clientSchema,
  paramSchema,
  querySchema,
  updateSchema
} from '../schema/client.schema'
const router = express.Router()

router.get('/', validateResource(querySchema), getAllClientHandler)
router.post('/', validateResource(clientSchema), createClientHandler)
router.get('/:id', validateResource(paramSchema), getSingleClientHandler)
router.post('/:id', validateResource(updateSchema), updateClientHandler)
router.delete('/:id', validateResource(paramSchema), deleteClientHandler)

export default router
