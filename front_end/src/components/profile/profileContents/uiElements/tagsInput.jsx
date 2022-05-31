import {useRef} from "react";

function TagsInput({tags,setCurrentTags}) {

    const tagsInput=useRef(null);

    function startInput(){
        tagsInput.current.focus()
    }

    return (
        <>
            <div onClick={startInput} id="tagsInputContainer">
                {tags.map((tag)=>{
                    return (<span key={`${tag}_tag`}>
                        {tag} <span className="removeBtn"></span>
                    </span>);
                })}
                <input ref={tagsInput} type="text"/>
            </div>

            <style>
                {`
                    #tagsInputContainer{
                        display:flex;
                        flex-wrap:wrap;
                        max-width:100%;
                        width:calc(100%);
                        height:250px;
                        overflow-y:scroll;
                        color: var(--color);
                        font-family:Quicksand,sans-serif;
                        font-weight:bold;
                        text-transform:capitalize;
                        padding:15px;
                        background-color: var(--backGround);
                        box-shadow: 1px 1px 2px 1px var(--backGround);
                        border-radius: 4px;
                        border: 2px ridge var(--color);
                        border-top: 0;
                        border-bottom: 0;
                        z-index:8;
                    }

                    #tagsInputContainer span{
                        display:flex;
                        flex-wrap:wrap;
                        background-color:white;
                        width:fit-content;
                        height:fit-content;
                        padding:5px;
                        margin-right:5px;
                        margin-bottom:7px;
                        flex-direction: row;
                        align-items: center;
                        border-radius:4px;
                    }

                    #tagsInputContainer span .removeBtn{
                        display:inline-block;
                        width:15px;
                        height:15px;
                        background-size: contain;
                        margin-left:7px;
                        cursor:pointer;
                        margin-top:5px;
                    }

                    #tagsInputContainer input{
                        background-color:transparent;
                        width:fit-content;
                        padding: 0 5px;
                        border:none;
                        outline:none;
                        box-shadow:none;
                    }
                `}
            </style>
        </> 
     );
}

export default TagsInput;