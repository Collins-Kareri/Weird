import {useEffect, useReducer, useRef} from "react";


function TagsInput({tags,modalStatus,setIsModified}) {

    const TAGS_INPUT=useRef(null);
    const TAG_REMOVEBTN=useRef(null);
    const [currentState,dispatch]=useReducer(reducer,{tags:[]});

    function reducer(currentState,action){
        let alteretedState;
        switch (action.type){
            case("init"):
                return {tags:action.payload};
            case("rmTag"):
                alteretedState=action.payload.filter((tag)=>{
                    return tag !== action.tag;
                });

                setIsModified("yes");

                return {tags:alteretedState};
            case("reset"):
                return {tags:action.payload};
            case("addTag"):
                alteretedState=action.payload.concat(action.tag);

                setIsModified("yes");
                
                return {tags:alteretedState};
            default:
                return currentState
        }
    }
  
    useEffect(()=>{

        dispatch({type:"init",payload:tags});

        return ()=>{
            if(modalStatus === "close")
            {
                dispatch({type:"reset",payload:tags});
            }
        } 
    },[tags,modalStatus]);

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
        let tag=currentState.tags;
        if(KEY_PRESSED==="backspace" && VALUE.length===0)
        {
            let lastIndex=currentState.tags.length-1
            evt.preventDefault();
            dispatch({type:"rmTag",tag:tag[lastIndex],payload:tag});
            return;
        }

        if( (KEY_PRESSED=== "," || KEY_PRESSED=== "enter" ) && VALUE.length>0 && VALUE !== ",")
        {
            evt.preventDefault();
            TAGS_INPUT.current.value="";
            dispatch({type:"addTag",tag:VALUE.toLowerCase(),payload:tag});
            return;
        }
    }

    return (
        <>
            <div onClick={startInput} id="tagsInputContainer">
                {currentState.tags.map((tag)=>{
                    return (<span key={`${tag}_tag`} data-within="tags">
                        {tag} <span ref={TAG_REMOVEBTN} onClick={()=>{dispatch({type:"rmTag",tag:`${tag}`,payload:currentState.tags})}} className="removeBtn"></span>
                    </span>);
                })}
                <input ref={TAGS_INPUT} onKeyDown={handleKeyDown} placeholder="enter tag" type="text"/>
            </div>
        </> 
     );
}

export default TagsInput;