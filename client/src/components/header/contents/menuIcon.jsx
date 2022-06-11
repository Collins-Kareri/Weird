import { useState } from "react";

function MenuIcon() {

  const [isActive,setActive]=useState(false);

  function handleClick(){
    return setActive(!isActive);
  };

    return <>
    <section 
              onClick={handleClick}
              id="menuIcon"
            >
       <span />
       <span />
       <span />
    </section>
  
  <style>{`/*menu Icon styling on menu active*/
  
    #menuIcon span:nth-of-type(1) {
      transform: ${isActive?"translate(3px, 3.9px) rotate(45deg)":"translate(0) rotate(0)"};
    }
  
    #menuIcon span:nth-of-type(2) {
      transform:  ${isActive?"rotate(-45deg)":"rotate(0)"};
    }
  
    #menuIcon span:nth-of-type(3) {   
       transform:  ${isActive?"translate(-3px, -4px) rotate(45deg)":"translate(0) rotate(0)"};
    }

    #menuContent{
      display:${isActive?"block":"none"};
      opacity:${isActive?1:0};
    }
  `}</style>
  </>;
};

export default MenuIcon;