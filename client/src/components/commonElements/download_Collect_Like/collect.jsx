import {useReducer} from "react";
import CollectModal from "components/commonElements/download_Collect_Like/collectModal";
import CreateCollectionModal from "components/commonElements/download_Collect_Like/createModal";

function reducer(currentState,action){
    switch(action.type)
    {
        case("collection"):
            return {...currentState,collection_Modal_State:action.payload};
        case("createCollection"):
            return {...currentState,createCollection_Modal_State:action.payload}
        default:
            return currentState;
    }
}

function Collect() {
    const [currentState,dispatch]=useReducer(reducer,{collection_Modal_State:"close",collections:[],createCollection_Modal_State:"close"});

    function toggleModal_State(modal){
        const CURRENT_MODAL_STATE=currentState[`${modal}_Modal_State`];

        if(CURRENT_MODAL_STATE==="open")
        {
            dispatch({type:modal,payload:"close"});
            return;
        }
        dispatch({type:modal,payload:"open"});
        return;
    }

    return (
        <>
            <span onClick={()=>{toggleModal_State("collection")}} className="secondary collect_Btn">
            </span>
            {currentState.collection_Modal_State==="close"?<></>:<CollectModal toggleModal_State={toggleModal_State} collections={currentState.collections}/>}
            {currentState.createCollection_Modal_State === "close"?<></>:<CreateCollectionModal toggleModal_State={toggleModal_State}/>}
        </>
     );
}

export default Collect;