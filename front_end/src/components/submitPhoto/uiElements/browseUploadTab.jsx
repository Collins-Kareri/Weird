import { useEffect, useRef,useState} from "react";
import {handleFileData,sendToCloudinary,generateSignature,storeInDb} from "util"

function BrowseUpload({images,setImages,setCurrentProgress}) {
    const fileBrowse=useRef(null),
        [results,setResults]=useState([]);

    useEffect(()=>{
        if( images.length>0 && results.length===images.length && results[0]!=="saved" )
        {
            storeInDb(results,setCurrentProgress,setResults);
        }
    },[images.length, results, setCurrentProgress])

    async function onChange(evt){
        const FILES=evt.target.files,
            IMAGES=await handleFileData(FILES,true);
            
        setImages(IMAGES);
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
            storeInDb(results,setCurrentProgress,setResults);
            return;
        }

        const SIGNATUREOBJ=await generateSignature({uploadType:"image"});

        for(let image of images)
        {
            if(SIGNATUREOBJ === "server error"){
                return;
            }
            const REQ_DATA=
            {
                file:image.url,
                identifier:image.name,
                noOfValuesToUpload:images.length,
                signatureObj:SIGNATUREOBJ,
                uploadType:"image",
                setProgress: setCurrentProgress,
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