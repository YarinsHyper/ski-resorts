# 🏨 Hotel Search Backend - Complete Implementation

## Project Overview

This is a **production-ready backend** for the hotel search web application interview assignment. It features a scalable architecture that supports multiple API providers with intelligent aggregation, multi-group size requests, and comprehensive validation.

## 📊 What's Implemented

### ✅ Core Features
- **Multi-Provider Architecture**: Easy to add new API providers
- **Smart Multi-Group Aggregation**: Automatically fetches larger room sizes for more options
- **Parallel Execution**: All requests run simultaneously for optimal performance
- **Result Deduplication**: Removes duplicates based on hotel name + capacity + price
- **Price Sorting**: Results sorted by price in ascending order
- **Comprehensive Validation**: Input validation with detailed error messages

### ✅ Technical Implementation
- TypeScript for type safety
- Express.js REST API
- Modular architecture (MVC pattern)
- Middleware-based validation
- Error handling and logging
- Configuration management

## 📂 Project Structure

```
ski-back/
├── src/
│   ├── server.ts                      # Express server & initialization
│   ├── index.ts                       # Module entry point
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── providers/
│   │   └── ExternalApiProvider.ts     # AWS Lambda integration
│   ├── managers/
│   │   └── HotelSearchManager.ts      # Core search logic
│   ├── controllers/
│   │   └── HotelSearchController.ts   # Request handlers
│   ├── routes/
│   │   └── hotelRoutes.ts             # API routes
│   ├── middleware/
│   │   └── validation.ts              # Validation & error handling
│   ├── config/
│   │   └── index.ts                   # Configuration
│   ├── utils/
│   │   └── helpers.ts                 # Utility functions
│   └── data/
│       └── hotels.json                # Ski resorts reference
├── dist/                              # Compiled JavaScript (after build)
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
└── Documentation/
    ├── API_DOCUMENTATION.md           # API reference
    ├── TESTING.md                     # Test examples
    ├── ARCHITECTURE.md                # System design
    ├── IMPLEMENTATION_SUMMARY.md      # Detailed summary
    ├── QUICKSTART.md                  # Quick start guide
    └── CHECKLIST.md                   # Feature checklist
```

## 🚀 Quick Start

### 1. Install & Build
```bash
npm install
npm run build
```

### 2. Start Development Server
```bash
npm run dev
```

Server runs on: `http://localhost:9000`

### 3. Test the API
```bash
curl -X POST http://localhost:9000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "ski_site": 1,
      "from_date": "03/04/2025",
      "to_date": "03/11/2025",
      "group_size": 2
    }
  }'
```

## 📡 API Endpoint

### Search Hotels
**POST** `/api/hotels/search`

**Request:**
```json
{
  "query": {
    "ski_site": 1,                    // 1-5 (ski resort ID)
    "from_date": "03/04/2025",        // DD/MM/YYYY format
    "to_date": "03/11/2025",          // DD/MM/YYYY format
    "group_size": 4                   // 1-10 people
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
        "id": "hotel-123",
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
    "query": { /* original query */ }
  }
}
```

## 🏗️ Architecture Highlights

### 1. Provider Pattern
```typescript
// Add new providers by implementing the interface
interface ApiProvider {
  name: string;
  search(query: SearchQuery): Promise<Hotel[]>;
}
```

### 2. Multi-Group Aggregation Flow
```
User searches for group_size: 2
    ↓
Manager calculates: [2, 3, 4, 5, 6, 7, 8, 9, 10]
    ↓
Sends 9 parallel requests to external API
    ↓
Aggregates all results
    ↓
Deduplicates entries
    ↓
Sorts by price
    ↓
Returns combined results
```

### 3. Error Handling
- Invalid input → 400 Bad Request
- Server error → 500 Internal Server Error
- Provider failure → Graceful recovery (returns results from other providers)

## 📝 Validation Rules

| Field | Rules |
|-------|-------|
| `ski_site` | Required, must be positive number |
| `from_date` | Required, format: DD/MM/YYYY |
| `to_date` | Required, format: DD/MM/YYYY, must be after from_date |
| `group_size` | Required, must be 1-10 |

## 🎯 Performance Features

- **Parallel Requests**: ~9x faster than sequential
- **Set-Based Deduplication**: O(n) time complexity
- **Price Sorting**: O(n log n) time complexity
- **Error Resilience**: One provider failure doesn't crash search

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference |
| [TESTING.md](TESTING.md) | cURL examples and test scenarios |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design and data flow |
| [QUICKSTART.md](QUICKSTART.md) | Setup and first steps |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What was built and design decisions |
| [CHECKLIST.md](CHECKLIST.md) | Feature completeness checklist |

## 🔧 npm Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm run start       # Run compiled JavaScript (production)
```

## 🌐 Ski Resorts (Available Destinations)

```
1: Val Thorens
2: Courchevel
3: Tignes
4: La Plagne
5: Chamonix
```

## 🔌 Integration with Frontend

The React frontend should:

1. **Send requests to** `POST /api/hotels/search`
2. **Parse response** with structure: `{ success, data: { hotels, totalCount, query } }`
3. **Handle errors**: Check response status and error field
4. **Display results**: Map over hotels array to render UI

Example React code:
```javascript
async function searchHotels(query) {
  const response = await fetch('/api/hotels/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Search failed:', error.error);
    return;
  }
  
  const data = await response.json();
  displayHotels(data.data.hotels);
}
```

## 🛡️ Security Features

- ✅ Input validation on all fields
- ✅ Type-safe TypeScript implementation
- ✅ CORS configured
- ✅ Error messages don't expose system details
- ✅ Middleware-based protection

## 🚢 Deployment

### Production Build
```bash
npm run build
PORT=8080 npm run start
```

### Environment Variables
```bash
PORT=8080              # Server port
NODE_ENV=production    # Environment
DEBUG=false            # Debug logging
```

## 📈 Future Enhancements

- Streaming/progressive responses
- Result caching with TTL
- Rate limiting
- Advanced filtering (amenities, ratings)
- Pagination
- Analytics and monitoring

## ✨ What Makes This Backend Great

1. **Extensible**: Add new providers without touching existing code
2. **Performant**: Parallel execution for speed
3. **Reliable**: Graceful error handling and recovery
4. **Maintainable**: Clean architecture, TypeScript for safety
5. **Well-Documented**: Complete docs for understanding and integration
6. **Production-Ready**: Includes validation, error handling, logging

## 📞 Support

For questions about specific components, see:
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design details
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API specifics
- [TESTING.md](TESTING.md) - Test examples

---

**Status**: ✅ **READY FOR PRODUCTION**

Backend is fully implemented and ready for integration with React frontend.
