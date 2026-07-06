import { HotelSearchQuery, Hotel } from "../types/hotel.types";

const BASE_API_URL = process.env.REACT_APP_API_URL || "http://localhost:9000";

export const searchHotels = async (
  query: HotelSearchQuery
): Promise<Hotel[]> => {
  try {
    const response = await fetch(`${BASE_API_URL}/api/hotels/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data.hotels || [];
  } catch (error) {
    console.error("Hotel search error:", error);
    throw error;
  }
};

export const searchHotelsWithRoomSizes = async (
  baseQuery: HotelSearchQuery
): Promise<Hotel[]> => {
  const hotels = await searchHotels(baseQuery);
  return hotels.sort((a, b) => a.price - b.price);
};
