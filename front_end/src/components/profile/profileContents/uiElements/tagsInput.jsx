import { useRef} from "react";

function TagsInput({tags,dispatch}) {

    const TAGS_INPUT=useRef(null);
    const TAG_REMOVEBTN=useRef(null);

    function startInput(evt){
        const EL_CLASSNAME=evt.target.className;

        if(typeof EL_CLASSNAME !== "undefined" && EL_CLASSNAME === "removeBtn")
        {
            return;
        }

        TAGS_INPUT.current.focus();
        return;
    }

    function handleKeyDown(evt){
        const VALUE=evt.target.value;
        const KEY_PRESSED=evt.key.toLowerCase();

        if(KEY_PRESSED==="backspace" && VALUE.length===0)
        {
            let lastIndex=tags.length-1
            evt.preventDefault();
            dispatch({type:"rmTag",tag:tags[lastIndex],payload:tags});
            return;
        }

        if( (KEY_PRESSED=== "," || KEY_PRESSED=== "enter" ) && VALUE.length>0 && !(/,/.test(VALUE)) && !(tags.includes(VALUE)))
        {
            evt.preventDefault();
            TAGS_INPUT.current.value="";
            dispatch({type:"addTag",tag:VALUE.toLowerCase(),payload:tags});
            return;
        }
    }

    return (
        <>
            <div onClick={startInput} id="tagsInputContainer">
                {tags.map((tag)=>{
                    return (<span key={`${tag}_tag`} data-within="tags">
                        {tag} <span ref={TAG_REMOVEBTN} onClick={()=>{dispatch({type:"rmTag",tag:`${tag}`,payload:tags})}} className="removeBtn"></span>
                    </span>);
                })}
                <input ref={TAGS_INPUT} onKeyDown={handleKeyDown} placeholder="enter tag" type="text"/>
            </div>
        </> 
     );
}

export default TagsInput;