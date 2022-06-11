import { useState } from "react";

function SearchBarIcons(){
  const [isActive,setActive]=useState(false);

  function handleClick()
  {
    setActive(!isActive);
  };

 return<>
         <div id="searchBarIcons">
           <span onClick={handleClick} id="searchOpenIcon" />
           <span onClick={handleClick} id="searchCloseIcon" />
         </div>

         <style>
           {
           `
             #searchOpenIcon{
              transform:${isActive?"translateY(-40px)":"translateY(0)"};
             }
             #searchCloseIcon{
              transform:${isActive?"translateY(-40px)":"translateY(0)"};
             }
             #searchBar{
               display:${isActive?"block":"none"};
               opacity:${isActive?1:0};
             }
             `
           }
         </style>
       </> 
};

export default SearchBarIcons;