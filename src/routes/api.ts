import express from 'express';
import { Request, Response, NextFunction } from 'express';
import IndexController from '../app/Http/Controllers/IndexController';
import DocumentationBasicAuthMiddleware from '../app/Http/Middlewares/DocumentationBasicAuthMiddleware';
import BookingCellController from '../app/Http/Controllers/RetailCrmController';
import RetailCrmController from '../app/Http/Controllers/RetailCrmController';
const router = express.Router();

// IndexController
const indexController = new IndexController();
router.get('/', (request: Request, response: Response, next: NextFunction) => {
    indexController.index(request, response, next);
});

// Documentation
const documentaionBasicAuthMiddleware = new DocumentationBasicAuthMiddleware();
router.use('/docs', [
    documentaionBasicAuthMiddleware.handle,
    express.static(process.cwd() + '/docs', { index: 'index.html' })
]);

const retailCrm = new RetailCrmController();
router.post('/api/v1/booking', (request: Request, response: Response, next: NextFunction) => {
    retailCrm.updateStatus(request, response, next);
});
router.get('/api/v1/check/:identifier', (request: Request, response: Response, next: NextFunction) => {
    retailCrm.checkStatus(request, response, next);
});
router.put('/api/v1/status/transfer', (request: Request, response: Response, next: NextFunction) => {
    retailCrm.statusTranfer(request, response, next);
});

export default router;
