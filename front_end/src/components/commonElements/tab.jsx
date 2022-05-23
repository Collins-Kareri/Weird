function Tab({handleClick,active}) {

    return ( 
        <div className="tab">
            <span id="photosTab" className={active==="photos"?"active":""} onClick={handleClick}>Photos</span>
            <span id="collectionsTab" className={active==="collections"?"active":""} onClick={handleClick}>Collections</span>
        </div>
     );
};

export default Tab;