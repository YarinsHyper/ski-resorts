import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import { searchHotelsWithRoomSizes } from "../../api/hotel.api";
import { HotelSearchQuery } from "../../types/hotel.types";
import { formatDate } from "../../utils/format.util";
import { NavBarProps } from "../../types/NavBar.types";
import { SearchData } from "../../types/Search.types";
import SearchForm from "../search-form/search-form";

const NavBar = ({
  setHotels,
  setError,
  setIsLoading,
  isLoading,
}: NavBarProps) => {
  const handleSearch = async (data: SearchData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const query: HotelSearchQuery = {
        ski_site: Number(data.destination),
        from_date: formatDate(data.startDate),
        to_date: formatDate(data.endDate),
        group_size: data.groupSize,
      };

      const results = await searchHotelsWithRoomSizes(query);
      setHotels(results);
    } catch (err) {
      setError("Failed to search hotels. Please try again.");
      console.error(err);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="nav-bar">
      <div className="nav-bar__inner">
        <WeSkiLogo />
        <div className="nav-bar__search">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
