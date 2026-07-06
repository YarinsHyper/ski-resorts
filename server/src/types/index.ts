export interface SearchQuery {
  ski_site: number;
  from_date: string; // Format: DD/MM/YYYY
  to_date: string; // Format: DD/MM/YYYY
  group_size: number; // 1-10
}
interface HotelImage {
  url: string;
  MainImage?: boolean | string;
}

export interface Hotel {
  id: string;
  name: string;
  room_type: string;
  capacity: number;
  price: number;
  available_rooms: number;
  ski_site: number;
  provider: string;
  images: HotelImage[];
}

export interface HotelSearchResult {
  hotels: Hotel[];
  totalCount: number;
}

export interface ApiProviderResponse {
  hotels: Hotel[];
}

export interface ApiProvider {
  name: string;
  search(query: SearchQuery): Promise<Hotel[]>;
}
