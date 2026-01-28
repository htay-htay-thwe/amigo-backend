import axios from "axios";
import { getAmadeusToken } from "./amadeusAuth";
import {
  AmadeusFlightOffer,
  SimplifiedFlight,
  FlightSearchParams,
} from "./types";

/**
 * Get IATA location code from city name using Amadeus API
 */
async function getLocationCode(cityName: string): Promise<string> {
    console.log(cityName);
  try {
    const token = await getAmadeusToken();

    console.log(`🔍 Looking up location code for: ${cityName}`);

    const response = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword: cityName,
          subType: "CITY,AIRPORT",
        },
      }
    );

    const locations = response.data.data || [];
    if (locations.length === 0) {
      throw new Error(`No location found for: ${cityName}`);
    }

    // Prefer AIRPORT over CITY
    const airport = locations.find((loc: any) => loc.subType === "AIRPORT");
    const location = airport || locations[0];
    
    const iataCode = location.iataCode;
    
    if (!iataCode || iataCode.length !== 3) {
      throw new Error(`Invalid IATA code for ${cityName}: ${iataCode}`);
    }

    console.log(`✓ Found location code for ${cityName}: ${iataCode} (${location.subType})`);
    return iataCode.toUpperCase();
  } catch (error: any) {
    console.error("Location lookup error:", error.response?.data || error.message);
    throw new Error(`Failed to find location code for: ${cityName}`);
  }
}

/**
 * Fetch flights between two airports on a specific date
 * Supports both IATA codes and city names
 */
export async function fetchFlights(
  params: FlightSearchParams
): Promise<SimplifiedFlight[]> {
  try {
    const token = await getAmadeusToken();

    // Resolve location codes from city names if needed
    let originCode = params.originLocationCode;
    let destinationCode = params.destinationLocationCode;

    if (!originCode && params.originCity) {
      originCode = await getLocationCode(params.originCity);
    }

    if (!destinationCode && params.destinationCity) {
      destinationCode = await getLocationCode(params.destinationCity);
    }

    if (!originCode || !destinationCode) {
      throw new Error("Origin and destination are required (either as IATA codes or city names)");
    }

    console.log(
      `🔍 Searching flights: ${originCode} → ${destinationCode} on ${params.departureDate}`
    );

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate: params.departureDate,
          adults: params.adults || 1,
          nonStop: params.nonStop !== undefined ? params.nonStop : true,
          currencyCode: params.currencyCode || "THB",
          max: params.max || 10,
        },
      }
    );

    const flights: SimplifiedFlight[] = response.data.data.map(
      (offer: AmadeusFlightOffer) => {
        const segment = offer.itineraries[0].segments[0];

        return {
          airline: segment.carrierCode,
          airline_logo: `https://content.airhex.com/content/logos/airlines_${segment.carrierCode}_200_200_s.png`,
          flight_number: `${segment.carrierCode}${segment.number}`,
          departure_airport: segment.departure.iataCode,
          arrival_airport: segment.arrival.iataCode,
          departure_time: segment.departure.at,
          arrival_time: segment.arrival.at,
          duration: segment.duration,
          cost_thb: Math.round(parseFloat(offer.price.total)),
          available_seats: offer.numberOfBookableSeats,
        };
      }
    );

    console.log(`✓ Found ${flights.length} flights`);
    return flights;
  } catch (error: any) {
    console.error(
      "✗ Flight fetch error:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to fetch flights: ${error.response?.data?.errors?.[0]?.detail || error.message}`
    );
  }
}


