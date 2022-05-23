import { useState } from "react";

function InputContainer({inputType,inputName,isRequired,inputValue,labelContent,isPasswordContainer}) {


  const [togglePswd,setTogglePswd]=useState(false);

  function showPswd(){
    setTogglePswd(!togglePswd);
  };

    return (  
    <div className="inputContainer" id={isPasswordContainer?"passwordContainer":""}>
      <label htmlFor={inputName}>{labelContent}</label>
      <input 
        type={inputType==="password"&&togglePswd?"text":inputType} 
        name={inputName} 
        required={isRequired?isRequired:""}
        placeholder={inputType?inputValue:""}
        id={inputName}
      />
      {isPasswordContainer?<span className="show_Hide_Pwsd" onClick={showPswd}></span>:<></>}
    </div> 
);
}

export default InputContainer;