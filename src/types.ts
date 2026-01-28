export interface FlightSegment {
  carrierCode: string;
  number: string;
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  duration: string;
}

export interface FlightItinerary {
  segments: FlightSegment[];
  duration: string;
}

export interface FlightPrice {
  total: string;
  currency: string;
}

export interface AmadeusFlightOffer {
  id: string;
  itineraries: FlightItinerary[];
  price: FlightPrice;
  numberOfBookableSeats?: number;
}

export interface SimplifiedFlight {
  airline: string;
  airline_logo: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  cost_thb: number;
  available_seats?: number;
}

export interface FlightSearchParams {
  originLocationCode?: string;
  destinationLocationCode?: string;
  originCity?: string;
  destinationCity?: string;
  departureDate: string;
  adults?: number;
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}

export interface HotelSearchParams {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  currency?: string;
  sortOrder?: string;
  pageSize?: number;
}

export interface SimplifiedHotel {
  hotel_name: string;
  address: string;
  star_rating: number;
  total_cost_thb: number;
  check_in: string;
  check_out: string;
  amenities: string[];
  hotel_photos: string[];
  price_per_night?: number;
  rating?: number;
  review_count?: number;
}
