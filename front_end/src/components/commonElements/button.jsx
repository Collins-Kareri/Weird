function Button({btnId,btnClassName,btnClick,btnType,btnDisplayText}) {
  return ( 
  <button id={btnId?btnId:""} className={btnClassName} onClick={btnClick} type={btnType?btnType:""}>
    {btnDisplayText}
  </button> );
}

export default Button;