import  { useState } from "react";
import "./FilterComponent.css";
import SelectIem from '../searchBar/SelectIem';

function FilterOptions({ options, handleClose, filterQuery, setFilterOption }: any) {
    const [query, setQuery] = useState("");
    const  [selectedOption, setSelectedOption] = useState(filterQuery.value);

    const filteredItems = options.filter((item: any) => item.name.toLowerCase().includes(query.toLowerCase()));
    const selectFilterOption = (e: any, option: any) => {
        e.stopPropagation();
        setSelectedOption(option);
    }
    return (
        <>
            <div className='filter-box' onClick={(e) => e.stopPropagation()}>
                <SelectIem setQuery={setQuery} query={query} />
                <p className='selector-separator' />
                {filteredItems && filteredItems.length > 0 && filteredItems.map((option: any, index: number) => {
                    return <p className={selectedOption === option.name ? "selectedFilterOption" : undefined} key={index} onClick = {(e: any) => selectFilterOption(e, option.name)}>{option.name}</p>
                })}
                <span className='button-container'>
                    <button className='cancel-button' onClick={() => handleClose()}>Cancel</button>
                    <button className='apply-button' onClick={() => setFilterOption(selectedOption)}>Apply</button>
                </span>
            </div>
        </>)
}
export default FilterOptions;