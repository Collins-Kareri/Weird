//url or index or name, the other images
import Button from "../../../commonElements/button";
import Tab from "../../../commonElements/tab";
import InputContainer from "../../../commonElements/inputContainer";
import { useState } from "react";

function EditPhotosModal({assetUrl,assetTags,modalstatus,setModalStatus}) {


    const TAB_ARR=[{outputName:"tags",active:true},{outputName:"description",active:false}],
        [active,setActive]=useState("tags");

    function close(){
        setModalStatus("close");
        return;
    }

    function saveChanges(evt){
    }

    function onChange(evt){

    }

    return ( 
        <div className="modalContainer editPhotosModal">
            <div id="photoEdit">
                <section id="editImageActions">
                    <Button btnClassName={"secondary"} btnDisplayText="save changes"/>
                    <Button btnClassName={"tertiary"} btnDisplayText="close" btnClick={close}/>
                </section>
                <div id="modal-imgContainer" style={{height:"300px",backgroundColor:"steelblue",margin:"0 auto"}}>
                    <img src={assetUrl} alt="to edit"/>
                </div>
                <div id="next-previous-imgBtns">
                    <Button btnClassName={"secondary"} btnDisplayText="previous" btnId={"previous"}/>
                    <Button btnClassName={"secondary"} btnDisplayText="next" btnId={"next"}/>
                </div>
                <Tab tab_arr={TAB_ARR} setActive={setActive}/>
                {active==="tags"?<InputContainer inputType={"text"} inputValue={assetTags} onChange={onChange}/>:<textarea placeholder={"enter a description"}></textarea>}
            </div>

            <style>
                {
                    `
                        #modal-imgContainer{
                            display:flex;
                            width:min(300px,80%);
                            flex-direction: row;
                            flex-wrap: wrap;
                            align-content: center;
                            justify-content: center;
                        }

                        #modal-imgContainer img{
                            position:relative;
                            width:80%;
                            height:fit-content;
                        }

                        #next-previous-imgBtns{
                            display:flex;
                            width:100%;
                            flex-direction: row;
                            flex-wrap: wrap;
                            justify-content: space-evenly;
                            margin-top:15px;
                        }
                        .editPhotosModal{
                            display:${modalstatus==="open"?"block":"none"};
                            opacity:${modalstatus==="open"?"1":"0"};
                        }

                        #photoEdit{
                            display: block;
                            position: fixed;
                            z-index:7;
                            width: 90%;
                            top: 12%;
                            left:50%;
                            transform: translate(-50%,-10%);
                            font-family: Quicksand,sans-serif;
                            background-color:white;
                            border:0.2px solid black;
                            padding:15px 30px;
                            border-radius:8px;
                        }

                        #editImageActions{
                            display:flex;
                            position:relative;
                            flex-wrap: wrap;
                            flex-direction: row;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom:15px;
                        }

                        .editPhotosModal .tab {
                            display: flex;
                            position:relative;
                            top:0;
                            font-size: 16px;
                            margin-bottom:0;
                            box-shadow: inset 0px 0px 0px 0px var(--backGround);
                        }

                        .editPhotosModal .tab>span {
                            padding:15px 10px;
                        }
                    `
                }
            </style>
        </div>
     );
}

export default EditPhotosModal;