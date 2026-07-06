import { Router, Request, Response, NextFunction } from 'express';
import { HotelSearchController } from '../controllers/HotelSearchController';

export function createHotelRoutes(controller: HotelSearchController): Router {
  const router = Router();

  router.post('/search', (req: Request, res: Response, next: NextFunction) => {
    controller.search(req, res);
  });

  return router;
}
