# Backend Testing Guide

## Test the Backend with cURL or Postman

### 1. Health Check
```bash
curl http://localhost:9000
```

### 2. Search Hotels - Basic Request
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

### 3. Search Hotels - Different Group Size
```bash
curl -X POST http://localhost:9000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "ski_site": 2,
      "from_date": "01/05/2025",
      "to_date": "01/08/2025",
      "group_size": 4
    }
  }'
```

### 4. Test Validation - Missing Field
```bash
curl -X POST http://localhost:9000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "ski_site": 1,
      "from_date": "03/04/2025"
    }
  }'
```

### 5. Test Validation - Invalid Date Format
```bash
curl -X POST http://localhost:9000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "ski_site": 1,
      "from_date": "2025-03-04",
      "to_date": "2025-03-11",
      "group_size": 2
    }
  }'
```

### 6. Test Validation - Invalid Group Size
```bash
curl -X POST http://localhost:9000/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "ski_site": 1,
      "from_date": "03/04/2025",
      "to_date": "03/11/2025",
      "group_size": 15
    }
  }'
```

## Expected Behaviors

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "hotels": [
      {
        "id": "...",
        "name": "Hotel Name",
        "room_type": "Standard",
        "capacity": 2,
        "price": 100,
        "available_rooms": 5,
        "ski_site": 1,
        "provider": "ExternalHotelsSimulator"
      }
    ],
    "totalCount": 10,
    "query": {
      "ski_site": 1,
      "from_date": "03/04/2025",
      "to_date": "03/11/2025",
      "group_size": 2
    }
  }
}
```

### Validation Error (400 Bad Request)
```json
{
  "error": "Invalid group_size: must be between 1 and 10"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

## Testing Multiple Group Sizes

When a user searches for group_size: 2, the backend will:
1. Make requests for group sizes: 2, 3, 4, 5, 6, 7, 8, 9, 10
2. Aggregate all results from the external API
3. Deduplicate by hotel name + capacity + price
4. Sort by price ascending
5. Return combined results

## Ski Resort IDs

Based on `src/data/hotels.json`:
- 1: Val Thorens
- 2: Courchevel
- 3: Tignes
- 4: La Plagne
- 5: Chamonix

## Performance Notes

- All group size requests execute in parallel for optimal performance
- If one provider fails, others continue and results are still returned
- Results are sorted by price for easy browsing
