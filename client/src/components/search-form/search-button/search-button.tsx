import React from "react";
import "./search-button.scss";

const SearchButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button className="search-button" onClick={onClick}>
      Search
    </button>
  );
};

export default SearchButton;
