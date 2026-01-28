import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchFlights } from "./fetchFlights";
import { fetchHotels, fetchHotelsBangkok, fetchHotelsChiangMai } from "./fetchHotels";
import { FlightSearchParams, HotelSearchParams } from "./types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  next();
});

/**
 * Health check endpoint
 */
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "✈️ Amigo Flight API is running",
    version: "1.0.0",
    endpoints: {
      health: "GET /",
      flights: "GET /api/flights",
      flightsCNXDMK: "GET /api/flights/cnx-dmk",
      flightsBKKCNX: "GET /api/flights/bkk-cnx",
      hotels: "GET /api/hotels",
      hotelsBangkok: "GET /api/hotels/bangkok",
      hotelsChiangMai: "GET /api/hotels/chiangmai",
    },
  });
});

/**
 * Generic flight search endpoint
 * Query params: origin, destination, date, adults, nonStop, currency, max
 * Supports both IATA codes (CNX, BKK) and city names (Bangkok, Chiang Mai)
 */
app.get("/api/flights", async (req: Request, res: Response) => {
  try {
    const {
      origin,
      destination,
      date,
      adults,
      nonStop,
      currency,
      max,
    } = req.query;

    // Validate required parameters
    if (!origin || !destination || !date) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: ["origin", "destination", "date"],
        example: "/api/flights?origin=Bangkok&destination=Chiang Mai&date=2026-02-15",
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date as string)) {
      return res.status(400).json({
        error: "Invalid date format",
        expected: "YYYY-MM-DD",
        example: "2026-02-15",
      });
    }

    const originStr = origin as string;
    const destStr = destination as string;

    // Check if it's IATA code (3 letters) or city name
    const isOriginIATA = /^[A-Z]{3}$/i.test(originStr);
    const isDestIATA = /^[A-Z]{3}$/i.test(destStr);

    const params: FlightSearchParams = {
      ...(isOriginIATA 
        ? { originLocationCode: originStr.toUpperCase() } 
        : { originCity: originStr }),
      ...(isDestIATA 
        ? { destinationLocationCode: destStr.toUpperCase() } 
        : { destinationCity: destStr }),
      departureDate: date as string,
      adults: adults ? parseInt(adults as string) : 1,
      nonStop: nonStop === "true" || nonStop === undefined,
      currencyCode: (currency as string)?.toUpperCase() || "THB",
      max: max ? parseInt(max as string) : 10,
    };

    const flights = await fetchFlights(params);
    res.json({
      success: true,
      count: flights.length,
      route: `${origin} → ${destination}`,
      date: params.departureDate,
      flights,
    });
  } catch (error: any) {
    console.error("Flight search error:", error.message);
    res.status(500).json({
      error: "Flight search failed",
      message: error.message,
    });
  }
});


/**
 * Generic hotel search endpoint
 * Query params: destination, checkIn, checkOut, adults, currency, sortOrder, pageSize
 */
app.get("/api/hotels", async (req: Request, res: Response) => {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      adults,
      currency,
      sortOrder,
      pageSize,
    } = req.query;

    // Validate required parameters
    if (!destination) {
      return res.status(400).json({
        error: "Missing required parameter: destination",
        example: "/api/hotels?destination=Bangkok&checkIn=2026-02-15&checkOut=2026-02-17",
      });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        error: "Missing required parameters: checkIn and checkOut",
        example: "/api/hotels?destination=Bangkok&checkIn=2026-02-15&checkOut=2026-02-17",
      });
    }

    const params: HotelSearchParams = {
      destination: destination as string,
      checkInDate: checkIn as string,
      checkOutDate: checkOut as string,
      adults: adults ? parseInt(adults as string) : 1,
      currency: (currency as string) || "THB",
      sortOrder: (sortOrder as string) || "PRICE",
      pageSize: pageSize ? parseInt(pageSize as string) : 5,
    };
    const hotels = await fetchHotels(params);

    res.json({
      success: true,
      count: hotels.length,
      destination: destination,
      checkIn: checkIn,
      checkOut: checkOut,
      data: hotels,
    });
  } catch (error: any) {
    console.error("❌ Hotel search error:", error.message);
    res.status(500).json({
      error: "Hotel search failed",
      message: error.message,
    });
  }
});



// Start server
app.listen(PORT);
