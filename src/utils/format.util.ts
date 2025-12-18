import { Hotel } from "../types/hotel.types";

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);

export const getMainImageUrl = (hotel: Hotel): string | undefined => {
  if (!hotel.images || hotel.images.length === 0) return undefined;

  const main =
    hotel.images.find(
      (img) => img.MainImage === true || img.MainImage === "true"
    ) ?? hotel.images[0];

  return main?.url;
};
