# Amigo Flight Backend

Backend API for searching real-time flight data using Amadeus API.

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Amadeus API Credentials
1. Sign up at [Amadeus Developers](https://developers.amadeus.com/)
2. Create a new app to get your API Key and Secret
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Add your credentials to `.env`

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /
```
Returns server status and available endpoints.

### Generic Flight Search
```
GET /api/flights?origin=CNX&destination=DMK&date=2026-02-15
```

**Query Parameters:**
- `origin` (required) - Origin airport code (e.g., CNX, BKK)
- `destination` (required) - Destination airport code (e.g., DMK, CNX)
- `date` (required) - Departure date in YYYY-MM-DD format
- `adults` (optional) - Number of adults (default: 1)
- `nonStop` (optional) - Only non-stop flights (default: true)
- `currency` (optional) - Currency code (default: THB)
- `max` (optional) - Max results (default: 10)

### CNX to DMK Route
```
GET /api/flights/cnx-dmk?date=2026-02-15
```
Chiang Mai to Bangkok Don Mueang flights.

### BKK to CNX Route
```
GET /api/flights/bkk-cnx?date=2026-02-15
```
Bangkok to Chiang Mai flights.

## 📱 Frontend Integration

### React Native Example
```javascript
async function getFlights(origin, destination, date) {
  const response = await fetch(
    `http://YOUR_SERVER_IP:4000/api/flights?origin=${origin}&destination=${destination}&date=${date}`
  );
  return response.json();
}

// Usage
const data = await getFlights('CNX', 'DMK', '2026-02-15');
console.log(data.flights);
```

### Response Format
```json
{
  "success": true,
  "count": 5,
  "route": "CNX → DMK",
  "date": "2026-02-15",
  "flights": [
    {
      "airline": "TG",
      "airline_logo": "https://content.airhex.com/content/logos/airlines_TG_200_200_s.png",
      "flight_number": "TG2345",
      "departure_airport": "CNX",
      "arrival_airport": "DMK",
      "departure_time": "2026-02-15T08:30:00",
      "arrival_time": "2026-02-15T09:45:00",
      "duration": "PT1H15M",
      "cost_thb": 2500,
      "available_seats": 9
    }
  ]
}
```

## 🏗️ Project Structure

```
amigo-backend/
├── src/
│   ├── server.ts          # Express server & routes
│   ├── amadeusAuth.ts     # Authentication & token caching
│   ├── fetchFlights.ts    # Flight search logic
│   └── types.ts           # TypeScript interfaces
├── .env.example           # Environment variables template
├── package.json
└── tsconfig.json
```

## 🔧 Environment Variables

```env
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
PORT=4000
```

## 📝 Notes

- Uses Amadeus Test API (free tier with test data)
- Access token is cached to minimize API calls
- CORS enabled for frontend integration
- TypeScript for type safety
- Automatic error handling and validation

## 🌐 Deployment

For production deployment, replace `test.api.amadeus.com` with `api.amadeus.com` in:
- `src/amadeusAuth.ts`
- `src/fetchFlights.ts`

And use your production API credentials.
