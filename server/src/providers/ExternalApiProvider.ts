import axios from "axios";
import { ApiProvider, Hotel, SearchQuery } from "../types";

export class ExternalApiProvider implements ApiProvider {
  name = "ExternalHotelsSimulator";
  private baseUrl =
    "https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator";

  async search(query: SearchQuery): Promise<Hotel[]> {
    try {
      const response = await axios.post(this.baseUrl, {
        query: {
          ski_site: query.ski_site,
          from_date: query.from_date,
          to_date: query.to_date,
          group_size: query.group_size,
        },
      });

      return this.transformResponse(response.data, query.ski_site);
    } catch (error) {
      console.error(`Error fetching from ${this.name}:`, error);
      return [];
    }
  }

  private transformResponse(data: any, ski_site: number): Hotel[] {
    if (!data) {
      return [];
    }

    const accommodations =
      data.body?.accommodations || data.accommodations || [];

    if (!Array.isArray(accommodations)) {
      return [];
    }

    return accommodations.map((hotel) => ({
      id:
        hotel.HotelCode ||
        hotel.id ||
        `${this.name}-${hotel.HotelName}-${Date.now()}`,
      name: hotel.HotelName || hotel.name || "Unknown Hotel",
      room_type: hotel.room_type || "Standard",
      capacity: parseInt(hotel.HotelInfo?.Beds) || hotel.capacity || 2,
      price: parseFloat(hotel.PricesInfo?.AmountAfterTax) || hotel.price || 0,
      available_rooms: hotel.available_rooms || 1,
      ski_site,
      provider: this.name,
      images: hotel.HotelDescriptiveContent?.Images || [],
    }));
  }
}
