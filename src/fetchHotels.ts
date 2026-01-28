import axios from "axios";
import { SimplifiedHotel, HotelSearchParams } from "./types";

/**
 * Destination ID mapping for Booking.com
 * Pre-configured popular Thai destinations
 */
const DEST_ID_MAP: Record<string, string> = {
  "Bangkok": "-3414440",
  "Bangkok, Thailand": "-3414440",
  "Chiang Mai": "-3237187",
  "Chiang Mai, Thailand": "-3237187",
  "Phuket": "-3242976",
  "Phuket, Thailand": "-3242976",
  "Pattaya": "-3714993",
  "Pattaya, Thailand": "-3714993",
};

/**
 * Get destination ID (use pre-configured mapping)
 */
async function getDestId(destination: string): Promise<string> {
  console.log(`🔍 Looking up dest_id for: ${destination}`);
  
  const destId = DEST_ID_MAP[destination] || DEST_ID_MAP["Bangkok"];
  console.log(`✓ Using dest_id: ${destId}`);
  
  return destId;
}

/**
 * Fetch hotels from Booking.com API
 */
export async function fetchHotels(params: HotelSearchParams): Promise<SimplifiedHotel[]> {
  try {
    const {
      destination,
      checkInDate,
      checkOutDate,
      adults = 1,
      currency = "THB",
      pageSize = 5,
    } = params;

    // Step 1: Get dest_id
    const destId = await getDestId(destination);

    // Step 2: Search hotels
    console.log(`🏨 Searching hotels in ${destination} (dest_id: ${destId})...`);
    
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels",
      {
        headers: {
          "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
        params: {
          dest_id: destId,
          search_type: "CITY",
          arrival_date: checkInDate,
          departure_date: checkOutDate,
          adults: adults.toString(),
          children_age: "0,17",
          room_qty: "1",
          page_number: "1",
          units: "metric",
          temperature_unit: "c",
          languagecode: "en-us",
          currency_code: currency,
        },
      }
    );

    console.log(`📊 API Response Status: ${response.status}`);
    
    const hotels = response.data?.data?.hotels || [];
    console.log(`🏨 Hotels found: ${hotels.length}`);

    if (hotels.length === 0) {
      throw new Error(`No hotels found for ${destination}`);
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    return hotels.slice(0, pageSize).map((hotel: any) => {
      // Extract price
      const pricePerNight = hotel.property?.priceBreakdown?.grossPrice?.value || 1500;
      const totalCost = pricePerNight * nights;

      // Extract amenities
      const amenities: string[] = [];
      if (hotel.property?.checkinCheckoutTimes?.checkout) {
        amenities.push("Flexible Check-out");
      }
      if (hotel.property?.reviewScore > 8) {
        amenities.push("Highly Rated");
      }
      amenities.push("Free Cancellation", "Free Wi-Fi");

      // Extract photos
      const photos: string[] = [];
      if (hotel.property?.photoUrls && hotel.property.photoUrls.length > 0) {
        photos.push(...hotel.property.photoUrls.slice(0, 2));
      }

      // Fallback photos
      if (photos.length === 0) {
        photos.push(
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
        );
      }

      return {
        hotel_name: hotel.property?.name || "Hotel",
        address: `${hotel.property?.address || destination}`.trim(),
        star_rating: hotel.property?.starRating || 3,
        total_cost_thb: Math.round(totalCost),
        check_in: checkInDate,
        check_out: checkOutDate,
        amenities: amenities.slice(0, 4),
        hotel_photos: photos,
        price_per_night: Math.round(pricePerNight),
        rating: hotel.property?.reviewScore ? parseFloat(hotel.property.reviewScore) : undefined,
        review_count: hotel.property?.reviewCount || 0,
      };
    });
  } catch (error: any) {
    console.error("Hotel fetch error:", error.response?.data || error.message);
    throw new Error(`Failed to fetch hotels: ${error.message}`);
  }
}

