import {useState} from "react";
import BrowseUpload from "./browseUploadTab";
import DragAndDrop from "./dragAndDrop";
import PreviewSelected from "./previewSelected";
import ProgressIndicator from "./progressIndicator";
import SuccessMsg from "./successMsg";

function SubmitPageContent({isLoading}) {

    const [images,setImages]=useState([]),
        [progress,setProgress]=useState(0),
        [doneStatus,setDoneStatus]=useState("no");

    return (
       <>
            <BrowseUpload images={images} setImages={setImages} setProgress={setProgress} isLoading={isLoading} setDoneStatus={setDoneStatus}/>
            <DragAndDrop setImages={setImages} isLoading={isLoading}/>
            <div id="imagesContainer">
                <PreviewSelected images={images} setImages={setImages}/>
            </div>
            <div id="flashMsg">
                <section id="flashMsgContent">
                    {progress===100||doneStatus==="yes"?<></>:<ProgressIndicator progress={progress}/>}
                    {doneStatus==="yes"?<SuccessMsg/>:<></>}
                </section>
            </div>

            <style>
                {
                    `
                        #menuSubmitBtn{
                            display:none;
                        }
                        .separator{
                            display:none;
                        }
                        #flashMsg{
                            display:${(progress>0&&isFinite(progress))||doneStatus==="yes"?"flex":"none"};
                            opacity:${(progress>0&&isFinite(progress))||doneStatus==="yes"?"1":"0"}
                        }
                        #dragAndDropContainer{
                            display:${images.length>0?"none":"block"};
                            opacity:${images.length>0?"0":"1"};
                            transition:all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                        }
                    `
                }
            </style>
       </> 
     );
};
 
export default SubmitPageContent;