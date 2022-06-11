import { useState } from "react";

function InputContainer({inputType,inputName,isRequired,inputValue,placeholder,labelContent,isPasswordContainer,onChange}) {


  const [togglePswd,setTogglePswd]=useState(false);

  function showPswd(){
    setTogglePswd(!togglePswd);
  };

    return (  
    <div className="inputContainer" id={isPasswordContainer?"passwordContainer":""}>
      {typeof labelContent !== "undefined" && labelContent.length>0?<label htmlFor={inputName}>{labelContent}</label>:<></>}
      <input 
        type={inputType==="password"&&togglePswd?"text":inputType} 
        name={inputName}
        value={inputValue} 
        required={isRequired?isRequired:""}
        placeholder={placeholder}
        onChange={onChange}
        id={inputName}
      />
      {isPasswordContainer?<span className="show_Hide_Pwsd" onClick={showPswd}></span>:<></>}
    </div> 
);
}

export default InputContainer;