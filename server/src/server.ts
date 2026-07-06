import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { HotelSearchManager } from './managers/HotelSearchManager';
import { HotelSearchController } from './controllers/HotelSearchController';
import { createHotelRoutes } from './routes/hotelRoutes';
import { validateSearchQuery, errorHandler } from './middleware/validation';
import { providerRegistry } from './providers/ProviderRegistry';
import { initializeProviders } from './providers';

const app: Express = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

initializeProviders(providerRegistry);

const searchManager = new HotelSearchManager(providerRegistry);
const hotelController = new HotelSearchController(searchManager);

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Hotel Search Backend',
    providers: providerRegistry.getProviderNames(),
  });
});

app.use('/api/hotels', validateSearchQuery, createHotelRoutes(hotelController));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
