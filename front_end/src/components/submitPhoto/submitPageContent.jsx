import {useState} from "react";
import BrowseUpload from "./browseUploadTab";
import DragAndDrop from "./dragAndDrop";
import PreviewSelected from "./previewSelected";

function SubmitPageContent({setProgress}) {

    const [images,setImages]=useState([]);

    return (
       <>
            <BrowseUpload images={images} setImages={setImages} setProgress={setProgress}/>
            <DragAndDrop setImages={setImages}/>
            <div id="imagesContainer">
                <PreviewSelected images={images} setImages={setImages}/>
            </div>
       </> 
     );
};
 
export default SubmitPageContent;