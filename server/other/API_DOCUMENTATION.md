# Hotel Search Backend API Documentation

## Overview
This is a Node.js backend for a hotel search application that integrates with external API providers to fetch hotel availability across multiple ski resorts.

## Key Architecture Features

### 1. **Provider Abstraction Layer**
- `ApiProvider` interface allows easy addition of new providers
- Currently implements `ExternalApiProvider` for the AWS Lambda API
- Supports future integration of additional providers without code changes

### 2. **Multi-Query Aggregation**
- Automatically requests hotels for multiple group sizes (e.g., search for 2 also gets 3, 4, 5+ person rooms)
- Executes all requests in parallel for performance
- Returns up to 10 person capacity rooms

### 3. **Data Deduplication & Sorting**
- Removes duplicate hotels based on name + capacity + price
- Sorts results by price in ascending order
- Aggregates results from all providers

## Project Structure

```
src/
├── server.ts                 # Main server entry point
├── types/index.ts           # TypeScript interfaces and types
├── providers/
│   └── ExternalApiProvider.ts # External API integration
├── managers/
│   └── HotelSearchManager.ts # Business logic for hotel search
├── controllers/
│   └── HotelSearchController.ts # Request handlers
├── routes/
│   └── hotelRoutes.ts       # API routes
├── middleware/
│   └── validation.ts        # Request validation
├── utils/
│   └── helpers.ts           # Utility functions
└── data/
    └── hotels.json          # Ski resort data
```

## API Endpoints

### Search Hotels
**POST** `/api/hotels/search`

**Request Body:**
```json
{
  "query": {
    "ski_site": 1,
    "from_date": "03/04/2025",
    "to_date": "03/11/2025",
    "group_size": 4
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hotels": [
      {
        "id": "unique-id",
        "name": "Hotel Name",
        "room_type": "Standard",
        "capacity": 4,
        "price": 150,
        "available_rooms": 2,
        "ski_site": 1,
        "provider": "ExternalHotelsSimulator"
      }
    ],
    "totalCount": 25,
    "query": {
      "ski_site": 1,
      "from_date": "03/04/2025",
      "to_date": "03/11/2025",
      "group_size": 4
    }
  }
}
```

## Validation Rules

- `ski_site`: Positive number (required)
- `from_date` & `to_date`: DD/MM/YYYY format, from_date < to_date (required)
- `group_size`: 1-10 (required)

## Environment Variables

- `PORT`: Server port (default: 9000)
- `DEBUG`: Set to enable debug logging

## Setup & Running

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

## Adding New Providers

To add a new API provider:

1. Create a new class implementing `ApiProvider` interface:
```typescript
export class NewProvider implements ApiProvider {
  name = 'NewProviderName';
  
  async search(query: SearchQuery): Promise<Hotel[]> {
    // Implementation
  }
}
```

2. Register in `server.ts`:
```typescript
const providers = [
  new ExternalApiProvider(),
  new NewProvider()
];
```

## Performance Considerations

1. **Parallel Requests**: All group size queries execute in parallel
2. **Error Handling**: Failed provider requests don't block the entire search
3. **Deduplication**: Removes duplicate results efficiently
4. **Sorting**: Client-side sorting for consistent results

## Error Handling

- Invalid requests return 400 status with detailed error messages
- Provider errors are logged but don't crash the server
- Server errors return 500 status

## Future Enhancements

- [ ] Caching layer for frequent searches
- [ ] Request timeout configuration per provider
- [ ] Rate limiting for API calls
- [ ] Progressive/streaming responses to client
- [ ] Advanced filtering (star rating, amenities, etc.)
- [ ] Pagination for large result sets
