import {useState} from "react";
import {handleInputData} from "../../util"

function DragAndDrop({setImages,isLoading}) {

    const [active,setActive]=useState(false);

    async function dropHandler(evt){
        evt.preventDefault();
        if(evt.dataTransfer.items)
        {
            isLoading("yes")
            const FILES=evt.dataTransfer.files,
                IMAGES=await handleInputData(FILES);
            setImages(IMAGES);
            isLoading("no");
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