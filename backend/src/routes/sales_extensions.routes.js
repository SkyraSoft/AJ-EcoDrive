import { Router } from 'express'
import { SalesExtensionsController } from '../controllers/sales_extensions.controller.js'

export const customOrdersRouter = Router()
customOrdersRouter.get('/', SalesExtensionsController.listCustomOrders)
customOrdersRouter.get('/:id', SalesExtensionsController.getCustomOrderById)
customOrdersRouter.post('/', SalesExtensionsController.createCustomOrder)
customOrdersRouter.put('/:id', SalesExtensionsController.updateCustomOrder)
customOrdersRouter.delete('/:id', SalesExtensionsController.deleteCustomOrder)

export const deliveriesRouter = Router()
deliveriesRouter.get('/', SalesExtensionsController.listDeliveries)
deliveriesRouter.get('/:id', SalesExtensionsController.getDeliveryById)
deliveriesRouter.post('/', SalesExtensionsController.createDelivery)
deliveriesRouter.put('/:id', SalesExtensionsController.updateDelivery)
deliveriesRouter.post('/:id/complete', SalesExtensionsController.completeDelivery)
deliveriesRouter.delete('/:id', SalesExtensionsController.deleteDelivery)

export const salesReturnsRouter = Router()
salesReturnsRouter.get('/', SalesExtensionsController.listSalesReturns)
salesReturnsRouter.get('/:id', SalesExtensionsController.getSalesReturnById)
salesReturnsRouter.post('/', SalesExtensionsController.createSalesReturn)
salesReturnsRouter.put('/:id', SalesExtensionsController.updateSalesReturn)
salesReturnsRouter.delete('/:id', SalesExtensionsController.deleteSalesReturn)
