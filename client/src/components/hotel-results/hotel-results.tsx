import React from "react";
import { Hotel } from "../../types/hotel.types";
import "./hotel-results.css";
import destinations from "../../data/destinations.json";
import { formatPrice, getMainImageUrl } from "../../utils/format.util";

interface HotelResultsProps {
  hotels: Hotel[];
  isLoading: boolean;
  error?: string;
}

const HotelResults: React.FC<HotelResultsProps> = ({
  hotels,
  isLoading,
  error,
}) => {
  if (error) return <div className="hr-state hr-state--error">{error}</div>;
  if (isLoading) return <div className="hr-state">Searching hotels…</div>;
  if (!hotels.length) return <div className="hr-state">No hotels found.</div>;

  return (
    <section className="hotel-results">
      <header className="hotel-results__header">
        <h2>Select your ski trip</h2>
        <p>{hotels.length} ski trip options</p>
      </header>

      <div className="hotel-list">
        {hotels.map((hotel) => {
          const imageUrl = getMainImageUrl(hotel);

          return (
            <article key={hotel.id} className="hotel-card">
              <div className="hotel-card__imageWrap">
                {imageUrl ? (
                  <img
                    className="hotel-card__image"
                    src={imageUrl}
                    alt={hotel.name}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="hotel-card__imageFallback"
                    aria-label="No image"
                  />
                )}
              </div>

              <div className="hotel-card__content">
                <div className="hotel-card__top">
                  <div>
                    <h3 className="hotel-card__name">{hotel.name}</h3>

                    <div className="hotel-card__meta">
                      <span className="pill">{hotel.room_type}</span>
                      <span className="dot">•</span>
                      <span>Capacity {hotel.capacity}</span>
                      <span className="dot">•</span>
                      <span>{hotel.available_rooms} rooms available</span>
                    </div>

                    <div className="hotel-card__provider">
                      📍 {destinations[hotel.ski_site].name}
                    </div>
                  </div>
                </div>

                <div className="hotel-card__bottom">
                  <div className="hotel-card__priceBlock">
                    <div className="hotel-card__price">
                      {formatPrice(hotel.price)}
                    </div>
                    <div className="hotel-card__priceLabel">per person</div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HotelResults;
