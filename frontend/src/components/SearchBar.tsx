import MultiselectDropdown from "./MultiselectDropdown.tsx";

function SearchBar(){
    const categoryOptions = ['Pets', 'Home', 'Food', 'Cleaning'];
    const categoryLabel = 'Category: ';

    const stockOptions = ['In stock', 'Out of stock', 'All']
    const stockLabel = 'Stock: '
    return(
        <>
            <div className={"container"}>
                <h2>Search Bar</h2>
                <div className={"container-searchControls"}>
                    <MultiselectDropdown options={categoryOptions} label={categoryLabel}/>
                    <MultiselectDropdown options={stockOptions} label={stockLabel}/>
                </div>
            </div>
        </>
    )
}

export default SearchBar