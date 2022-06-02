import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Progress from "./states/progress";
import Loading from "./states/loading";
import Success from "./states/success"
import Fail from "./states/fail";
import {saveToClientStorage} from "../../../util";

function PageState({currentProgress}) {

    const [pageState,setPageState]=useState(null);
    const REDIRECT=useNavigate();

    useEffect(()=>{
        window.addEventListener("storage",()=>{
            setPageState(sessionStorage.getItem("pageStatus").toLowerCase());
        });
    })

    function redirectToProfile(typeOfAction){
        saveToClientStorage("sessionStorage",[{key:"pageStatus",value:""}]);
        if(typeOfAction==="success")
        {
            REDIRECT("/profile",{replace:true});
        }
        return;
    }

    return (
        <>
            <div className="modalContainer statesContainer">
                {pageState==="progress"?<Progress currentProgress={currentProgress}/>:<></>}
                {pageState==="loading"?<Loading/>:<></>}
                {pageState==="success"?<Success handleClick={()=>{redirectToProfile("success")}}/>:<></>}
                {pageState==="fail"?<Fail handleClick={()=>{redirectToProfile("fail")}}/>:<></>}
            </div>
            <style>
            {
                `
                    .statesContainer{
                        display:${typeof pageState === "string" && pageState.length>0?"block":"none"};
                        z-index:8;
                    }
                
                    .statesContainer>.pageStateContent{
                        display: block;
                        position: fixed;
                        z-index:9;
                        width: 50%;
                        top: 50%;
                        left:50%;
                        transform: translate(-50%,-50%);
                        font-family: Quicksand,sans-serif;
                    }
                `
            }
            </style>
        </>
     );
}

export default PageState;