//url or index or name, the other images
import Button from "../../../commonElements/button";
import Tab from "../../../commonElements/tab";
import TagsInput from "./tagsInput";
import { useEffect, useState} from "react";

function EditPhotosModal({assetUrl,assetTags,modalstatus,setModalStatus}) {

    const TAB_ARR=[{outputName:"tags",active:true},{outputName:"description",active:false}],
        [active,setActive]=useState("tags"),
        [currentWidth,setCurrentWidth]=useState(window.innerWidth);

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
        setModalStatus("close");
        return;
    }

    function saveChanges(evt){
    }

    return ( 
        <div className="modalContainer editPhotosModal">
            <div id="photoEdit">
                <section id="editImageActions">
                    <Button btnClassName={"tertiary"} btnDisplayText="close" btnClick={close}/>
                    <Button btnClassName={"secondary"} btnDisplayText="save changes"/>
                </section>
                <div id="modal-contents" style={{display:"flex"}}>

                    <div id="modal-imgContainer" style={{height:"fit-content",margin:"0 auto",width:`${currentWidth>900?"30%":"100%"}`}}>
                        <img src={assetUrl} alt="to edit"/>
                    </div>

                    <section style={{display:"flex",position:"relative",width:`${currentWidth>900?"70%":"100%"}`, padding:"15px",flexDirection: "column", justifyContent: "flex-start",alignItems: "stretch"}}>
                        <Tab tab_arr={TAB_ARR} setActive={setActive}/>
                        {active==="tags"?<TagsInput tags={assetTags}/>:<textarea placeholder={"A good description makes a photo more discoverable."} spellCheck={true}></textarea>}
                    </section>

                </div>
            </div>

            <style>
                {`
                        .editPhotosModal{
                            display:${modalstatus==="open"?"block":"none"};
                            opacity:${modalstatus==="open"?"1":"0"};
                        }

                        #photoEdit{
                            width:${currentWidth>900?"50vw":"90%"};
                            top:${currentWidth>600?"50%":"150px"};
                            transform:translateY(${currentWidth>600?"calc(-50.5%)":"calc(-50)"}) translateX(${currentWidth>600?"calc(-49.5%)":"-102px"});
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