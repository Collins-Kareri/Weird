import Button from "../../../commonElements/button";
import Tab from "../../../commonElements/tab";
import TagsInput from "./tagsInput";
import { useEffect, useState,useReducer} from "react";
import {makeReq} from "../../../../util"

function EditPhotosModal({assetUrl,assetTags,modalStatus,setModalStatus}) {

    const TAB_ARR=[{outputName:"tags",active:true},{outputName:"description",active:false}];
    const [active,setActive]=useState("tags");
    const [currentWidth,setCurrentWidth]=useState(window.innerWidth);
    const [currentState,dispatch]=useReducer(reducer,{tags:[]});

    function reducer(currentState,action){
        let alteretedState;
        switch (action.type){
            case("init"):
                return {tags:action.payload};
            case("rmTag"):
                alteretedState=action.payload.filter((tag)=>{
                    return tag !== action.tag;
                });
                return {tags:alteretedState};
            case("reset"):
                return {tags:action.payload};
            case("addTag"):
                alteretedState=action.payload.concat(action.tag);
                return {tags:alteretedState};
            default:
                return currentState
        }
    }
      
    useEffect(()=>{
    
        dispatch({type:"init",payload:assetTags});

        return ()=>{
            if(modalStatus === "close")
            {
                dispatch({type:"reset",payload:assetTags});
            }
        } 
    },[assetTags,modalStatus]);

    useEffect(()=>{

        const updateDimensions=()=>{
            setCurrentWidth(window.innerWidth);
        }
        window.addEventListener("resize",updateDimensions)

        return ()=>{
            window.removeEventListener("resize",updateDimensions);
        }
    },[]);

    function close(){
        //check if current tags is equal to assetTags
        if( !(JSON.stringify(currentState.tags) === JSON.stringify(assetTags)) )
        {
            if(window.confirm("You haven't saved your changes are you sure you want to leave?"))
            {
                setModalStatus("close");
            }
            return;
        }

        setModalStatus("close");
        return;
    }

    function saveChanges(evt){
        if( !(JSON.stringify(currentState.tags) === JSON.stringify(assetTags)) )
        {
            makeReq()
        }

        return;
    }

    return ( 
        <div className="modalContainer editPhotosModal">
            <div id="photoEdit">
                <section id="editImageActions">
                    <Button btnClassName={"tertiary"} btnDisplayText="close" btnClick={close}/>
                    <Button btnClassName={"secondary"} btnDisplayText="save changes" btnClick={saveChanges}/>
                </section>
                <div id="modal-contents" style={{display:"flex"}}>

                    <div id="modal-imgContainer" style={{height:"fit-content",margin:"0 auto",width:`${currentWidth>900?"30%":"100%"}`}}>
                        <img src={assetUrl} alt="to edit"/>
                    </div>

                    <section style={{display:"flex",position:"relative",width:`${currentWidth>900?"70%":"100%"}`, padding:"15px",flexDirection: "column", justifyContent: "flex-start",alignItems: "stretch"}}>
                        <Tab tab_arr={TAB_ARR} setActive={setActive}/>
                        {active==="tags"?<TagsInput tags={currentState.tags} dispatch={dispatch}/>:<textarea placeholder={"A good description makes a photo more discoverable."} spellCheck={true}></textarea>}
                    </section>

                </div>
            </div>

            <style>
                {`
                        .editPhotosModal{
                            display:${modalStatus==="open"?"block":"none"};
                            opacity:${modalStatus==="open"?"1":"0"};
                        }

                        #photoEdit{
                            width:${currentWidth>900?"60vw":"90%"};
                            top:${currentWidth>900?"50%":"150px"};
                            transform:translateY(${currentWidth>900?"calc(-50%)":"calc(-102px)"}) translateX(-50%);
                        }

                        #modal-contents{
                            flex-direction:${currentWidth>600?"row":"column"}
                        }

                        #photoEdit section textarea{
                            height:250px;
                            width:100%;
                        }
                       
                `}
            </style>
        </div>
     );
}

export default EditPhotosModal;