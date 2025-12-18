import React, { useMemo, useState } from "react";
import destinations from "../../data/destinations.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./search-form.scss";

interface SearchProps {
  onSearch: (formData: SearchData) => void;
  isLoading: boolean;
}

export interface SearchData {
  destination: number;
  groupSize: number;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
}

function toYmd(date: Date): string {
  // local date to yyyy-mm-dd (no timezone shift)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const SearchForm: React.FC<SearchProps> = ({ onSearch, isLoading }) => {
  const [formData, setFormData] = useState<SearchData>({
    destination: 1,
    groupSize: 2,
    startDate: "",
    endDate: "",
  });

  // range picker state (Date objects)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [start, end] = dateRange;

  const canSubmit = useMemo(() => {
    return Boolean(
      formData.destination &&
        formData.groupSize &&
        formData.startDate &&
        formData.endDate
    );
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSearch(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "groupSize" ? parseInt(value, 10) : value,
    }));
  };

  const handleRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);

    const [s, e] = update;

    setFormData((prev) => ({
      ...prev,
      startDate: s ? toYmd(s) : "",
      endDate: e ? toYmd(e) : "",
    }));
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      {/* Destination */}
      <div className="form-group">
        <select
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
          aria-label="Destination"
        >
          {destinations.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name}
            </option>
          ))}
        </select>
      </div>

      {/* Group size */}
      <div className="form-group">
        <select
          id="groupSize"
          name="groupSize"
          value={formData.groupSize}
          onChange={handleChange}
          required
          aria-label="Group Size"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((size) => (
            <option key={size} value={size}>
              {size} people
            </option>
          ))}
        </select>
      </div>

      {/* ONE date field (range picker) */}
      <div className="form-group">
        <DatePicker
          selectsRange
          startDate={start}
          endDate={end}
          onChange={handleRangeChange}
          placeholderText="Dec 1 - Dec 12"
          dateFormat="MMM d"
          className="search-form-date-picker"
          isClearable
        />
      </div>

      <button type="submit" disabled={isLoading || !canSubmit}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchForm;
