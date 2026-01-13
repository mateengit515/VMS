import "./SearchBar.css"
const SearchBar = ({setQuery, query}: any) => {
  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        className="search-bar"
        onChange={(e) => setQuery(e.target.value)}
      />
    </>
  );
};

export default SearchBar;
