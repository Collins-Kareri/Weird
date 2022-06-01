//url or index or name, the other images
import Button from "../../../commonElements/button";
import Tab from "../../../commonElements/tab";
import TagsInput from "./tagsInput";
import { useEffect, useState} from "react";

function EditPhotosModal({assetUrl,assetTags,modalStatus,setModalStatus}) {

    const TAB_ARR=[{outputName:"tags",active:true},{outputName:"description",active:false}],
        [active,setActive]=useState("tags"),
        [currentWidth,setCurrentWidth]=useState(window.innerWidth),
        [isModified,setIsModified]=useState("no");

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
        if(isModified === "yes")
        {
            if(window.confirm("You haven't saved your changes are you sure you want to leave?"))
            {
                setIsModified("no");
                setModalStatus("close");
            }

            return;
        }

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
                        {active==="tags"?<TagsInput tags={assetTags} modalStatus={modalStatus} setIsModified={setIsModified}/>:<textarea placeholder={"A good description makes a photo more discoverable."} spellCheck={true}></textarea>}
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