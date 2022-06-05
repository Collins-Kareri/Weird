import Button from "../../../commonElements/button";
import Tab from "../../../commonElements/tab";
import TagsInput from "./tagsInput";
import { useEffect, useState,useReducer} from "react";
import {makeReq} from "../../../../util"

function EditPhotosModal({assetResource,modalStatus,setModalStatus,imagesArr,setImagesArr}) {

    const ARR_OF_TABS=[{outputName:"tags",active:true},{outputName:"description",active:false}];
    const [active,setActive]=useState("tags");
    const [currentWidth,setCurrentWidth]=useState(window.innerWidth);
    const [currentState,dispatch]=useReducer(reducer,{tags:[],saved:"no",description:""});

    function reducer(currentState,action){
        let alteretedState;
        switch (action.type){
            case("init"):
                return {...currentState, tags:action.payload.tags, description:action.payload.description};
            case("reset"):
                return { saved:"no", tags:action.payload.tags, description:action.payload.description};
            case("rmTag"):
                alteretedState=action.payload.filter((tag)=>{
                    return tag !== action.tag;
                });
                return {...currentState,tags:alteretedState};
            case("addTag"):
                alteretedState=action.payload.concat(action.tag);
                return {...currentState,tags:alteretedState};
            case("descriptionChange"):
                alteretedState=action.payload;
                return {...currentState,description:alteretedState};
            case("saved"):
                return {...currentState,saved:"yes"};
            default:
                return currentState;
        }
    }
    
    useEffect(()=>{
    
        dispatch({ type:"init",payload:{tags:assetResource.tags,description:assetResource.description} });

        return ()=>{
            if(modalStatus === "close")
            {
                dispatch({ type:"reset",payload:{tags:assetResource.tags,description:assetResource.description} });
            }
        } 
    },[assetResource.tags,assetResource.description,modalStatus]);

    useEffect(()=>{
        const updateDimensions=()=>{
            setCurrentWidth(window.innerWidth);
        }
        window.addEventListener("resize",updateDimensions)
        return ()=>{
            window.removeEventListener("resize",updateDimensions);
        }
    },[]);

    function checks(){
        if(!(JSON.stringify(currentState.tags) === JSON.stringify(assetResource.tags)))
        {
            return true;
        }

        if( currentState.description !== assetResource.description )
        {
            return true;
        }

        return false
    }

    function close(){
        //check if current tags is equal to assetResource.tags
        if( checks() && currentState.saved==="no" )
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

    async function saveChanges(){
        let{public_id}=assetResource;
        if( checks() )
        {
            let {data}=JSON.parse( await makeReq("/updateImgInfo","put",{data:{public_id,tags:currentState.tags,context:`alt=${currentState.description}`} }) );
            let newImgArr=imagesArr.map((val)=>{
                return val.public_id===public_id?{...val,tags:data.tags,description:data.context}:val;
            });
            dispatch({type:"saved"});
            setImagesArr(newImgArr);
            return;
        }

        return;
    }

    function handle_Textarea_Val_Change(evt){
        let value=evt.target.value;
        dispatch({type:"descriptionChange",payload:value});
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
                        <img src={assetResource.imgURL} alt="to edit"/>
                    </div>

                    <section style={{display:"flex",position:"relative",width:`${currentWidth>900?"70%":"100%"}`, padding:"0px 15px",flexDirection: "column", justifyContent: "flex-start",alignItems: "stretch"}}>
                        <Tab arr_of_tabs={ARR_OF_TABS} setActive={setActive}/>
                        {active==="tags"?<TagsInput tags={currentState.tags} dispatch={dispatch}/>:<textarea value={currentState.description} onChange={handle_Textarea_Val_Change} placeholder={"A good description makes a photo more discoverable."} spellCheck={true}></textarea>}
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