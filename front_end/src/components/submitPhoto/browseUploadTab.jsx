import { useEffect, useRef,useState} from "react";
import {handleInputData,sendToCloudinary,generateSignature,storeInDb} from "../../util"

function BrowseUpload({images,setImages,setProgress,isLoading, setDoneStatus}) {
    const fileBrowse=useRef(null),
        [results,setResults]=useState([]);

    useEffect(()=>{
        if(images.length>0&&results.length===images.length&&results[0]!=="saved"){
            storeInDb(results,setProgress,isLoading,setDoneStatus,setResults);
        }
    },[results])

    async function onChange(evt){
        isLoading("yes");
        const FILES=evt.target.files,
            IMAGES=await handleInputData(FILES);
            
        setImages(IMAGES);
        isLoading("no");
        return;
    }

    function openFileBrowser(evt){
        evt.preventDefault();
        fileBrowse.current.click();
    }

    async function handlePublish(evt,images){
        //take the images and upload them to serve one by one.
        
        if(images.length<1)
        {
            return;
        }

        if(images.length>0&&results.length===images.length&&results[0]!=="saved")
        {
            storeInDb(results,setProgress,isLoading,setDoneStatus,setResults);
            return;
        }

        const SIGNATUREOBJ=await generateSignature(setProgress,isLoading);

        for(let image of images)
        {
            if(SIGNATUREOBJ === "server error"){
                return;
            }
            const REQ_DATA=
            {
                file:image.url,
                identifier:image.name,
                numberOfImages:images.length,
                signatureObj:SIGNATUREOBJ,
                setProgress,
                isLoading,
                setResults
            }
            sendToCloudinary(REQ_DATA)
        }
    }

    return (  
        <>
            <input type="file" multiple={true} accept="image/*" onChange={onChange} ref={fileBrowse}/>
            <div id="submitPageSecondaryMenuContainer">
                <button className="secondary" type="button" onClick={openFileBrowser}>browse files</button>
                <button className="primary" onClick={(evt)=>{handlePublish(evt,images)}}>publish {images.length>1?"images":"image"}</button>
            </div>
        </>
    );
}

export default BrowseUpload;