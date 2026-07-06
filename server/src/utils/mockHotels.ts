import { Hotel, SearchQuery } from "../types";
import hotelsData from "../data/hotels.json";

const STATIC_HOTELS = hotelsData as Hotel[];

export function generateFallbackHotels(query: SearchQuery): Hotel[] {
  return STATIC_HOTELS.filter(
    (hotel) =>
      hotel.ski_site === query.ski_site && hotel.capacity >= query.group_size
  );
}
