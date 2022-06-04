import {useEffect, useState} from "react";

function Tab({arr_of_tabs,setActive}) {

    const [currentTabs,setCurrentTabs]=useState(arr_of_tabs);

    useEffect(()=>{
        // eslint-disable-next-line array-callback-return
        const ACTIVE_OBJ=currentTabs.find(((val)=>{
            if(val.active)
            {
                return val;
            }
        }));

        setActive(ACTIVE_OBJ.outputName);
    })

    function handleClick(evt){
        //get id from element then match the word before Tab. ie the id are written as "nameTab"...etc
        const ID=(evt.target.id).match(/(\w)+(?=tab)/gi).join();

        let results=currentTabs.map(({outputName,active})=>{
            if(ID===outputName && !(active) )
            {
                active=true;
                return {outputName,active};
            }
                active=false;
                return {outputName,active}
        });
        
        setCurrentTabs(results);
    }

    return ( 
        <div className="tab" style={{"textTransform":"capitalize"}}>
            {currentTabs.map(({outputName,active})=>{
                return <span
                        className={active?"active":""}
                        id={`${outputName}Tab`} 
                        key={`${outputName}Tab`}
                        onClick={handleClick}>{outputName}</span>
            })}
        </div>
     );
};

export default Tab;