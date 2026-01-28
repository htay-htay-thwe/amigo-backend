import axios from "axios";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: string | null = null;
let tokenExpiry = 0;

/**
 * Get Amadeus API access token with caching
 * Token is cached until it expires to minimize API calls
 */
export async function getAmadeusToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log("✓ Using cached Amadeus token");
    return cachedToken;
  }

  try {
    console.log("⟳ Fetching new Amadeus access token...");

    const response = await axios.post<TokenResponse>(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY!,
        client_secret: process.env.AMADEUS_API_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    cachedToken = response.data.access_token;
    // Set expiry with 60 second buffer to avoid edge cases
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    console.log("✓ New token obtained, valid for", response.data.expires_in, "seconds");
    return cachedToken;
  } catch (error: any) {
    console.error("✗ Failed to get Amadeus token:", error.response?.data || error.message);
    throw new Error("Authentication failed with Amadeus API");
  }
}

/**
 * Clear cached token (useful for testing or forced refresh)
 */
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
  console.log("✓ Token cache cleared");
}
