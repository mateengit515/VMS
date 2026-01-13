import "./FilterTabComponent.css";
import crossIcon from '../../images/cross-icon.png';
import filterIcon from '../../images/filter-icon.png';
import plusIcon from '../../images/plus-icon.png';

function FilterTabComponent({handleClose, openFilterTab, filters}: any) {
    console.log("filters", filters);
    return (
        <div className='filter-tab-background' onClick={() => {handleClose()}}>
        <div className={openFilterTab ? 'filter-tab-container': 'filter-tab-container-animation-out'}  onClick={(e) => {e.stopPropagation()}}>
            <img
                src={crossIcon}
                alt="Close"
                className='cross-icon-img'
                onClick={() => {handleClose()}}
                />
                <span className='heading'>
                    <img
                src={filterIcon}
                alt="Filter"
                className='filter-icon'
                />
                     Filters
                     </span>
                <p className='heading-separator' />
                <span className='sub-heading'>No filters applied</span>
                <button className='add-filters' onClick={() => {}}>
                    <img
                        src={plusIcon}
                        alt="Add"
                        className='plus-icon'
                    />
                    Add Filters</button>
                <span className='sub-heading'>Popular Filters</span>
                {filters && filters.length > 0 && filters.map((filter: any, index: number) => {
                    return <div key={index} className='filter-name'>
                        {filter.name}
                    </div>
                })
            }
        </div>
        </div>
    );
}

export default FilterTabComponent;