//url or index or name, the other images
import Button from "../../../commonElements/button";
import Tab from "../../../commonElements/tab";
import InputContainer from "../../../commonElements/inputContainer";
import { useState } from "react";

function EditPhotosModal({url,allImgs,modalstatus,setModalStatus}) {


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
                <div id="modal-imgContainer" style={{width:"300px",height:"300px",backgroundColor:"steelblue",margin:"0 auto"}}>
                    <img src="" alt="to edit"/>
                </div>
                <Tab tab_arr={TAB_ARR} setActive={setActive}/>
                {active==="tags"?<InputContainer inputType={"text"} inputValue={"tags"} onChange={onChange}/>:<textarea placeholder={"enter a description"}></textarea>}
            </div>

            <style>
                {
                    `
                        .editPhotosModal{
                            display:${modalstatus==="open"?"block":"none"};
                            opacity:${modalstatus==="open"?"1":"0"};
                        }

                        #photoEdit{
                            display: block;
                            position: fixed;
                            z-index:7;
                            width: 50%;
                            top: 10%;
                            left:50%;
                            transform: translate(-50%,-10%);
                            font-family: Quicksand,sans-serif;
                            background-color:white;
                            border:2px solid black;
                            padding:15px 30px;
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