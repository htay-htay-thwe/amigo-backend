# ✈️ Amigo Backend API

A robust RESTful API backend service for searching real-time flight and hotel data. Built with TypeScript, Express, and integrated with Amadeus API for flights and Booking.com API for hotels.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
  - [Health Check](#1-health-check)
  - [Flight Search](#2-flight-search)
  - [Hotel Search](#3-hotel-search)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Error Handling](#-error-handling)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Real-time Flight Search** - Search for flights using Amadeus API with flexible city name or IATA code support
- **Hotel Search** - Find hotels in popular Thai destinations using Booking.com API
- **Smart Location Resolution** - Automatically converts city names to IATA codes
- **Flexible Querying** - Support for multiple search parameters (adults, currency, date ranges, etc.)
- **Type-Safe** - Built with TypeScript for enhanced developer experience and code reliability
- **CORS Enabled** - Ready for cross-origin requests from frontend applications
- **Error Handling** - Comprehensive error handling with meaningful messages
- **Input Validation** - Request validation for all endpoints

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 20+
- **Language:** TypeScript 5.3
- **Framework:** Express.js 4.18
- **HTTP Client:** Axios
- **Authentication:** JWT, Google Auth Library
- **APIs:** Amadeus Travel API, Booking.com (via RapidAPI)
- **Development:** ts-node-dev for hot reloading

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- An [Amadeus API](https://developers.amadeus.com/) account with API credentials
- A [RapidAPI](https://rapidapi.com/) account with access to Booking.com API

---

## 🚀 Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/htay-htay-thwe/amigo-backend.git
   cd amigo-backend
   ```

2. **Install dependencies:**
   ```

3. **Create environment file:**
   ```powershell
   # Copy the example file (if available) or create a new .env file
   New-Item -Path .env -ItemType File
   ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000

# Amadeus API Credentials (for Flights)
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here

# RapidAPI Credentials (for Hotels - Booking.com)
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=booking-com15.p.rapidapi.com
```

### Getting API Credentials

**Amadeus API:**
1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Sign up for a free account
3. Create a new app in the dashboard
4. Copy your API Key and API Secret

**RapidAPI (Booking.com):**
1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for an account
3. Subscribe to [Booking.com API](https://rapidapi.com/DataCrawler/api/booking-com15)
4. Copy your RapidAPI Key from the dashboard

---

## 🏃 Running the Application

### Development Mode (with hot reload):
```powershell
npm run dev
```

The server will start on `http://localhost:4000` (or your configured PORT).

### Production Mode:
```powershell
# Build the TypeScript code
npm run build

# Start the server
npm start
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:4000
```

---

### 1. Health Check

**Endpoint:** `GET /`

**Description:** Returns server status and available endpoints.

**Response:**
```json
{
  "status": "ok",
  "message": "✈️ Amigo Flight API is running",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /",
    "flights": "GET /api/flights",
    "hotels": "GET /api/hotels"
  }
}
```

---

### 2. Flight Search

**Endpoint:** `GET /api/flights`

**Description:** Search for available flights between two locations on a specific date.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `origin` | string | Yes | - | Origin airport (IATA code like "CNX") or city name ("Chiang Mai") |
| `destination` | string | Yes | - | Destination airport (IATA code like "BKK") or city name ("Bangkok") |
| `date` | string | Yes | - | Departure date in YYYY-MM-DD format |
| `adults` | number | No | 1 | Number of adult passengers |
| `nonStop` | boolean | No | true | Only show non-stop flights |
| `currency` | string | No | THB | Currency code (THB, USD, EUR, etc.) |
| `max` | number | No | 10 | Maximum number of results |

**Example Request:**
```
GET /api/flights?origin=Bangkok&destination=Chiang Mai&date=2026-02-15&adults=2&currency=THB
```

Or using IATA codes:
```
GET /api/flights?origin=BKK&destination=CNX&date=2026-02-15&adults=2
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "route": "Bangkok → Chiang Mai",
  "date": "2026-02-15",
  "flights": [
    {
      "airline": "TG",
      "airline_logo": "https://content.airhex.com/content/logos/airlines_TG_200_200_s.png",
      "flight_number": "TG118",
      "departure_airport": "BKK",
      "arrival_airport": "CNX",
      "departure_time": "2026-02-15T08:30:00",
      "arrival_time": "2026-02-15T09:45:00",
      "duration": "PT1H15M",
      "cost_thb": 2500,
      "available_seats": 9
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required parameters",
  "required": ["origin", "destination", "date"],
  "example": "/api/flights?origin=Bangkok&destination=Chiang Mai&date=2026-02-15"
}
```

---

### 3. Hotel Search

**Endpoint:** `GET /api/hotels`

**Description:** Search for available hotels in a destination.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `destination` | string | Yes | - | Destination city (e.g., "Bangkok", "Chiang Mai", "Phuket", "Pattaya") |
| `checkIn` | string | Yes | - | Check-in date in YYYY-MM-DD format |
| `checkOut` | string | Yes | - | Check-out date in YYYY-MM-DD format |
| `adults` | number | No | 1 | Number of adult guests |
| `currency` | string | No | THB | Currency code (THB, USD, EUR, etc.) |
| `sortOrder` | string | No | PRICE | Sort order (PRICE, POPULARITY, etc.) |
| `pageSize` | number | No | 5 | Number of results to return |

**Supported Destinations:**
- Bangkok
- Chiang Mai
- Phuket
- Pattaya

**Example Request:**
```
GET /api/hotels?destination=Bangkok&checkIn=2026-02-15&checkOut=2026-02-17&adults=2
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "destination": "Bangkok",
  "checkIn": "2026-02-15",
  "checkOut": "2026-02-17",
  "data": [
    {
      "hotel_name": "Grand Palace Hotel",
      "address": "123 Sukhumvit Road, Bangkok",
      "star_rating": 5,
      "total_cost_thb": 4500,
      "check_in": "2026-02-15",
      "check_out": "2026-02-17",
      "amenities": ["Wi-Fi", "Pool", "Gym", "Restaurant"],
      "hotel_photos": ["https://example.com/photo1.jpg"],
      "price_per_night": 2250,
      "rating": 8.5,
      "review_count": 1250
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required parameter: destination",
  "example": "/api/hotels?destination=Bangkok&checkIn=2026-02-15&checkOut=2026-02-17"
}
```

---

## 📁 Project Structure

```
amigo-backend/
├── src/
│   ├── server.ts           # Main Express application & API routes
│   ├── amadeusAuth.ts      # Amadeus API authentication & token management
│   ├── fetchFlights.ts     # Flight search logic & data transformation
│   ├── fetchHotels.ts      # Hotel search logic & data transformation
│   └── types.ts            # TypeScript interfaces & type definitions
├── dist/                   # Compiled JavaScript (generated after build)
├── .env                    # Environment variables (not in git)
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── LICENSE                # Project license
└── README.md              # This file
```

---

## 🔌 API Integration

### Amadeus API (Flights)

This project uses the Amadeus Self-Service API for flight data:

- **Airport & City Search:** Converts city names to IATA codes
- **Flight Offers Search:** Returns real-time flight availability and pricing
- **Authentication:** OAuth 2.0 with token caching for performance

### Booking.com API (Hotels)

Hotel data is fetched via RapidAPI's Booking.com integration:

- **Destination Mapping:** Pre-configured destination IDs for Thai cities
- **Hotel Search:** Returns hotel listings with pricing and amenities
- **Filtering:** Supports currency, sort order, and result pagination

---

## 🛡️ Error Handling

The API includes comprehensive error handling:

- **400 Bad Request:** Missing or invalid parameters
- **500 Internal Server Error:** API failures or server errors

All errors return a JSON response with:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

---

## 🔧 Development

### Available Scripts

```powershell
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests (placeholder)
npm test
```

### TypeScript Configuration

The project uses strict TypeScript settings for enhanced type safety. See `tsconfig.json` for details.

### Code Structure

- **Modular Design:** Separate files for different API integrations
- **Type Safety:** Comprehensive TypeScript interfaces
- **Error Handling:** Try-catch blocks with meaningful error messages
- **Logging:** Console logs for debugging and monitoring

---

## 📱 Frontend Integration Example

### React/React Native
```javascript
const API_BASE_URL = 'http://localhost:4000';

// Search for flights
async function searchFlights(origin, destination, date) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/flights?origin=${origin}&destination=${destination}&date=${date}`
    );
    const data = await response.json();
    return data.flights;
  } catch (error) {
    console.error('Flight search failed:', error);
    throw error;
  }
}

// Search for hotels
async function searchHotels(destination, checkIn, checkOut) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Hotel search failed:', error);
    throw error;
  }
}

// Usage
const flights = await searchFlights('Bangkok', 'Chiang Mai', '2026-02-15');
const hotels = await searchHotels('Bangkok', '2026-02-15', '2026-02-17');
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**htay-htay-thwe**
- GitHub: [@htay-htay-thwe](https://github.com/htay-htay-thwe)

---

## 🙏 Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com/) - Flight API
- [RapidAPI](https://rapidapi.com/) - Booking.com Hotel API
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](#-api-documentation) section
2. Review the error messages in the response
3. Open an issue on GitHub

---

**Made with ❤️ for travelers**
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
