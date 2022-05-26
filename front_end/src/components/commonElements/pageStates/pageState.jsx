import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Progress from "./progress";
import Loading from "./loading";
import Success from "./success"
import Fail from "./fail";
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
            <div className="pageStateContainer">
                {pageState==="progress"?<Progress currentProgress={currentProgress}/>:<></>}
                {pageState==="loading"?<Loading/>:<></>}
                {pageState==="success"?<Success handleClick={()=>{redirectToProfile("success")}}/>:<></>}
                {pageState==="fail"?<Fail handleClick={()=>{redirectToProfile("fail")}}/>:<></>}
            </div>
            <style>
            {
                `
                    .pageStateContainer{
                        display:${typeof pageState === "string" && pageState.length>0?"block":"none"};
                        position:fixed;
                        flex-wrap: wrap;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100vh;
                        top:0;
                        left: 0;
                        transition-duration: 1s;
                        transition-property: all;
                        transition-timing-function: ease-in-out;
                        z-index: 6;  
                    }
                
                    .pageStateContainer::before{
                        content: "";
                        display: block;
                        position: relative;
                        width: 100%;
                        height: 100%;
                        background-color: var(--backGroundReducedOpacity);
                        opacity: 0.9;
                        filter: blur(2px);
                    }
                
                    .pageStateContainer>.pageStateContent{
                        display: block;
                        position: fixed;
                        z-index:7;
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