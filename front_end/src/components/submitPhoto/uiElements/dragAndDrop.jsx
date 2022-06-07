import {useState} from "react";
import {handleFileData,saveToClientStorage} from "util"

function DragAndDrop({setImages}) {

    const [active,setActive]=useState(false);

    async function dropHandler(evt){
        evt.preventDefault();
        if(evt.dataTransfer.items)
        {
            saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"loading"}])
            const FILES=evt.dataTransfer.files,
                IMAGES=await handleFileData(FILES,true);
            setImages(IMAGES);
            saveToClientStorage("sessionStorage",[{key:"pageStatus",value:""}])
            return;
        }
    }

    function dragEnterHandler(evt){
        evt.preventDefault();
        setActive(!active);
    }

    function dragLeaveHandler(evt){
        evt.preventDefault();
        setActive(!active);
    }

    function dragOverHandler(evt){
        evt.preventDefault();
    }

    return (
        <>
            <div id="dragAndDropContainer"  
                onDragEnter={dragEnterHandler} 
                onDragLeave={dragLeaveHandler}
                onDragOver={dragOverHandler}
                onDrop={dropHandler}>
                drag and drop files here
            </div>

            <style>
                {
                    `
                        #dragAndDropContainer{
                            color:${active?"hsl(0,10%,50%)":"hsl(1,5%,45%)"};
                            background-color:${active?"hsla(0,1%,100%,1)":"hsla(0,1%,90%,0.5)"};
                            border-style:solid;
                            border-width:0.1px;
                            border-color:${active?"hsl(0,10%,50%)":"hsl(1,5%,45%)"};
                            box-shadow:inset 1px 1px 7px 1.8px ${active?"hsl(0,10%,50%)":"hsl(1,5%,45%)"};
                        }
                    `
                }
            </style>
        </> 
    );
}

export default DragAndDrop;