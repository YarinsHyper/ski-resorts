# 🎿 Ski Resorts — Hotel Search

A full-stack hotel search application for ski resorts, split into two packages:

- **`client/`** — React + TypeScript + Vite frontend
- **`server/`** — Node.js/TypeScript backend (Express REST API)

---

## 📂 Repository Structure

```
ski-resorts/
├── client/                 # React + TypeScript + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── server/                 # Express + TypeScript backend
    ├── src/
    │   ├── server.ts                  # Express server & initialization
    │   ├── index.ts                   # Module entry point
    │   ├── types/                     # TypeScript interfaces
    │   ├── providers/                 # ExternalApiProvider.ts (AWS Lambda integration)
    │   ├── managers/                  # HotelSearchManager.ts (core search logic)
    │   ├── controllers/               # HotelSearchController.ts (request handlers)
    │   ├── routes/                    # hotelRoutes.ts (API routes)
    │   ├── middleware/                # validation.ts (validation & error handling)
    │   ├── config/                    # configuration
    │   ├── utils/                     # helper functions
    │   └── data/                      # hotels.json (ski resorts reference)
    ├── dist/                          # compiled JavaScript (after build)
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Quick Start

### Backend (`server/`)

```bash
cd server
npm install
npm run build
npm run dev        # http://localhost:9000
```

### Frontend (`client/`)

```bash
cd client
npm install
npm run dev
```

---

## 🏨 Backend — Complete Implementation

### Project Overview

The backend is a **production-ready** service for the hotel search web application. It features a scalable architecture that supports multiple API providers with intelligent aggregation, multi-group size requests, and comprehensive validation.

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

### 📡 API Endpoint

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

Test it with curl:
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

### 🏗️ Architecture Highlights

**1. Provider Pattern**
```typescript
// Add new providers by implementing the interface
interface ApiProvider {
  name: string;
  search(query: SearchQuery): Promise<Hotel[]>;
}
```

**2. Multi-Group Aggregation Flow**
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

**3. Error Handling**
- Invalid input → 400 Bad Request
- Server error → 500 Internal Server Error
- Provider failure → Graceful recovery (returns results from other providers)

### 📝 Validation Rules

| Field | Rules |
|-------|-------|
| `ski_site` | Required, must be positive number |
| `from_date` | Required, format: DD/MM/YYYY |
| `to_date` | Required, format: DD/MM/YYYY, must be after from_date |
| `group_size` | Required, must be 1-10 |

### 🎯 Performance Features
- **Parallel Requests**: ~9x faster than sequential
- **Set-Based Deduplication**: O(n) time complexity
- **Price Sorting**: O(n log n) time complexity
- **Error Resilience**: One provider failure doesn't crash search

### 🌐 Ski Resorts (Available Destinations)
```
1: Val Thorens
2: Courchevel
3: Tignes
4: La Plagne
5: Chamonix
```

### 🔌 Integration with the Frontend

The React frontend should:
1. **Send requests to** `POST /api/hotels/search`
2. **Parse response** with structure: `{ success, data: { hotels, totalCount, query } }`
3. **Handle errors**: check response status and error field
4. **Display results**: map over hotels array to render UI

Example:
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

### 🛡️ Security Features
- ✅ Input validation on all fields
- ✅ Type-safe TypeScript implementation
- ✅ CORS configured
- ✅ Error messages don't expose system details
- ✅ Middleware-based protection

### 🚢 Deployment

```bash
npm run build
PORT=8080 npm run start
```

**Environment Variables**
```bash
PORT=8080              # Server port
NODE_ENV=production    # Environment
DEBUG=false            # Debug logging
```

### 🔧 npm Scripts (server)
```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm run start       # Run compiled JavaScript (production)
```

### 📈 Future Enhancements
- Streaming/progressive responses
- Result caching with TTL
- Rate limiting
- Advanced filtering (amenities, ratings)
- Pagination
- Analytics and monitoring

---

## 💻 Frontend — React + TypeScript + Vite

The client is built on Vite's minimal React + TypeScript template, providing HMR and preconfigured ESLint rules.

Two official Vite plugins are available for Fast Refresh:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) — uses [Babel](https://babeljs.io/)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) — uses [SWC](https://swc.rs/)

### Expanding the ESLint configuration

If you are developing a production application, it's recommended to enable type-aware lint rules:

- Configure the top-level `parserOptions` property:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

---

## ✨ What Makes This Project Great

1. **Extensible**: Add new backend providers without touching existing code
2. **Performant**: Parallel execution for speed
3. **Reliable**: Graceful error handling and recovery
4. **Maintainable**: Clean architecture, TypeScript for safety throughout client and server
5. **Production-Ready**: Includes validation, error handling, and logging
