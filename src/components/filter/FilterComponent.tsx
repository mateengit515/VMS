import  {  useState } from 'react';
import downArrow from '../../images/down-arrow.png';
import filterIcon from '../../images/filter-icon.png';
import FilterOptions from './FilterOptions';
import FilterTabComponent from './FilterTabComponent';


function FilterComponent({ filterOptions, setFilterQuery, filterQuery }: any) {
    const [openDivIndex, setOpenDivIndex] = useState(null as number | null);
    const [openFilterTab, setOpenFilterTab] = useState(false);

    const handleToggle = (index: number) => {
        setOpenDivIndex(index === openDivIndex ? null : index);
    };

    return (<div className='container'>
        {filterOptions && filterOptions.length > 0 &&
            filterOptions.map((filter: any, index: number) => {
                return <div key={index} onClick={() => { handleToggle(index) }} className='filter-option'>
                    {filter.name}
                    <img
                        src={downArrow}
                        alt="VMS Logo"
                        className="down-arrow-img"
                    />
                    {openDivIndex === index && (<FilterOptions options={filter.options} handleClose={() => setOpenDivIndex(null)} filterQuery={filterQuery} setFilterOption={(op: string) => {
                        setFilterQuery({name: filter.nickName, value: op});
                        setOpenDivIndex(null);
                    }} />)}
                </div>
            })}
            <div className='filter-tab' onClick={(e) => {
                e.stopPropagation();
                setOpenFilterTab(!openFilterTab);
            }}>
            Filter
             <img
                        src={filterIcon}
                        alt="VMS Logo"
                        className="filter-icon-img"
                    />
            </div>
            {openFilterTab && (<FilterTabComponent handleClose={() => setOpenFilterTab(false)} openFilterTab={openFilterTab} filters={filterOptions}/>)}
            </div>
)}

export default FilterComponent;