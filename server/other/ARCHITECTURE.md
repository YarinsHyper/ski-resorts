# Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React)                           │
└────────────────────────┬────────────────────────────────────┘
                         │ POST /api/hotels/search
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                            │
│ ┌──────────────────────────────────────────────────────────┐│
│ │            Validation Middleware                         ││
│ │  - Checks ski_site, dates (DD/MM/YYYY), group_size    ││
│ └────────────────────┬─────────────────────────────────────┘│
│                      ▼                                       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │         HotelSearchController                            ││
│ │  - Receives validated request                           ││
│ │  - Calls HotelSearchManager                             ││
│ └────────────────────┬─────────────────────────────────────┘│
│                      ▼                                       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │         HotelSearchManager                              ││
│ │  1. Calculate group sizes: [2,3,4,5,6,7,8,9,10]       ││
│ │  2. For each group size & provider, create request      ││
│ │  3. Execute all in parallel                             ││
│ └────────────────────┬─────────────────────────────────────┘│
│                      ▼                                       │
│   ┌─────────────────────────────────────────────────────┐  │
│   │    ExternalApiProvider (implement ApiProvider)      │  │
│   │  - Transform query to provider format               │  │
│   │  - Call external API                                │  │
│   │  - Handle errors gracefully                         │  │
│   └──────────────┬───────────────────────────────────────┘  │
│                  ▼                                           │
└──────────────────────────────────────────────────────────────┘
                  │
    ┌─────────────┴──────────────────────┐
    ▼                                    ▼
External API                   Error Handling
AWS Lambda                    (Provider fails)
HotelsSimulator              Returns [] for that
                             request
```

## Data Flow - Step by Step

### 1. Request Received
```
Client sends:
POST /api/hotels/search
{
  "query": {
    "ski_site": 1,
    "from_date": "03/04/2025",
    "to_date": "03/11/2025",
    "group_size": 2
  }
}
```

### 2. Validation Phase
```
Middleware checks:
✓ ski_site is a number
✓ from_date is DD/MM/YYYY
✓ to_date is DD/MM/YYYY
✓ from_date < to_date
✓ group_size is 1-10
```

### 3. Search Manager Phase
```
Input: group_size = 2

Step 1: Calculate sizes to request
→ [2, 3, 4, 5, 6, 7, 8, 9, 10]

Step 2: Create 9 queries
Query 1: {ski_site: 1, from_date: "03/04/2025", to_date: "03/11/2025", group_size: 2}
Query 2: {ski_site: 1, from_date: "03/04/2025", to_date: "03/11/2025", group_size: 3}
...
Query 9: {ski_site: 1, from_date: "03/04/2025", to_date: "03/11/2025", group_size: 10}

Step 3: Execute all 9 queries in parallel to ExternalApiProvider

Step 4: Collect results:
Hotels from group_size 2: [Hotel1, Hotel2, Hotel3]
Hotels from group_size 3: [Hotel2, Hotel4, Hotel5]
Hotels from group_size 4: [Hotel1, Hotel6]
...

Step 5: Deduplicate
Use Set with key = name + capacity + price
Remove: Hotel1(from size 4) because Hotel1(from size 2) already exists
Remove: Hotel2(from size 3) because Hotel2(from size 2) already exists
Result: [Hotel1, Hotel2, Hotel3, Hotel4, Hotel5, Hotel6, ...]

Step 6: Sort by price ascending
[
  {name: "Budget Hotel", price: 50},
  {name: "Mid-Range", price: 150},
  {name: "Luxury Hotel", price: 300}
]
```

### 4. Response Sent
```
{
  "success": true,
  "data": {
    "hotels": [
      {
        "id": "provider-hotel-123",
        "name": "Hotel Name",
        "room_type": "Double",
        "capacity": 2,
        "price": 100,
        "available_rooms": 5,
        "ski_site": 1,
        "provider": "ExternalHotelsSimulator"
      },
      ...
    ],
    "totalCount": 15,
    "query": {...}
  }
}
```

## Provider Interface

All providers must implement this interface:

```typescript
interface ApiProvider {
  name: string;
  search(query: SearchQuery): Promise<Hotel[]>;
}
```

### Adding a New Provider

```typescript
// 1. Create new provider class
export class MyNewProvider implements ApiProvider {
  name = 'MyNewProvider';
  
  async search(query: SearchQuery): Promise<Hotel[]> {
    // Call your API
    // Transform response to Hotel[]
    // Handle errors
  }
}

// 2. Register in server.ts
const providers = [
  new ExternalApiProvider(),
  new MyNewProvider()  // ← Add here
];
```

## Error Scenarios

### Validation Error (400)
```
Client sends invalid group_size (15):
↓
Middleware validation fails
↓
Response: {"error": "Invalid group_size: must be between 1 and 10"}
```

### Provider Error (Internal Recovery)
```
Request to ExternalApiProvider fails:
↓
Error caught in HotelSearchManager.fetchFromAllProviders()
↓
Promise.allSettled() handles the error
↓
Returns empty array [] for that provider
↓
Other providers' results still returned
```

### Server Error (500)
```
Unexpected error in search logic:
↓
Caught by error handler middleware
↓
Response: {"error": "Internal server error", "message": "..."}
```

## Performance Optimization

### Parallel Execution
- **Without optimization**: 9 sequential requests = 9 * (response time)
- **With optimization**: 9 parallel requests ≈ 1 * (response time)
- **Result**: ~9x faster search

### Deduplication
- O(n) time complexity using Set
- Prevents duplicate hotel entries
- Improves user experience

### Sorting
- O(n log n) by price
- One-time operation after aggregation
- Fast for typical result sizes (< 1000 hotels)

## TypeScript Type Safety

All data flows through typed interfaces:
- SearchQuery: Input validation
- Hotel: Result structure
- ApiProvider: Provider contract
- HotelSearchResult: Response format

This ensures type safety throughout the entire request lifecycle.
