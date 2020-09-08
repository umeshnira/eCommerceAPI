import { Router } from 'express';
import invoiceController from '../controllers/invoice.controller';


const router = Router();

router.get(
    '/orders/:id([0-9]+)/invoice', [], invoiceController.getInvoiceOrderDetails);

router.get(
    '/orders/:id([0-9]+)/invoice/client', [], invoiceController.getInvoiceClientDetails);


export default router;