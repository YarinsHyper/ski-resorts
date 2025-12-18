export interface HotelSearchQuery {
  ski_site: number;
  from_date: string;
  to_date: string;
  group_size: number;
}

interface ImageObject {
  url: string;
  MainImage?: boolean | string;
}

export interface Hotel {
  id: string;
  name: string;
  room_type: string;
  capacity: number;
  available_rooms: number;
  price: number;
  provider: string;
  ski_site: number;
  images: ImageObject[];
}
