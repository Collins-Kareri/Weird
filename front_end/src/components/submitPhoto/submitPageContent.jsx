import {useState} from "react";
import BrowseUpload from "./browseUploadTab";
import DragAndDrop from "./dragAndDrop";
import PreviewSelected from "./previewSelected";

function SubmitPageContent({setCurrentProgress}) {

    const [images,setImages]=useState([]);

    return (
       <>
            <BrowseUpload images={images} setImages={setImages} setCurrentProgress={setCurrentProgress}/>
            <DragAndDrop setImages={setImages}/>
            <div id="imagesContainer">
                <PreviewSelected images={images} setImages={setImages}/>
            </div>
            <style>
                {
                    `
                        .separator{
                            display:none;
                        }
                        #dragAndDropContainer{
                            display:${images.length>0?"none":"block"}
                        }
                    `
                }
            </style>
       </> 
     );
};
 
export default SubmitPageContent;