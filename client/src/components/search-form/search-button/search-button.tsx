import "./search-button.scss";

const SearchButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="search-button" onClick={onClick}>
      Search
    </button>
  );
};

export default SearchButton;
