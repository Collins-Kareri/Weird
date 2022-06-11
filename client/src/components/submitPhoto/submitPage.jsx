import {useState} from "react";
import BrowseUpload from "components/submitPhoto/uiElements/browseUploadTab";
import DragAndDrop from "components/submitPhoto/uiElements/dragAndDrop";
import PreviewSelected from "components/submitPhoto/uiElements/previewSelected";

function SubmitPage({setCurrentProgress}) {

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
 
export default SubmitPage;