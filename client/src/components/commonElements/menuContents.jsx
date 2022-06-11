import NavLink from "./navLink";
import {useNavigate} from "react-router-dom";

function MenuContents({loggedIn}) {

    const redirect=useNavigate();

    function handleSubmitClick(evt){
      evt.preventDefault();
      const loggedInStatus=window.localStorage.getItem("loggedIn");
      if(typeof typeof loggedInStatus !== "undefined"){
          if(loggedInStatus === "yes"){
              redirect("/submit",{replace:true});
          }else{
              alert("You have to be logged in to submit photos.\nPlease login to your account or register for one.");
          };
      };
    };

    return ( 
      <div id="menuContent">
        <ul>
          <NavLink url="/" linkName="home"/>
          <NavLink url="/collections" linkName="collections"/>
          <NavLink linkId="submitPgLink" url="/submit" linkName="submit photo" clickHandler={handleSubmitClick}/>
          {loggedIn === "yes"
            ? <NavLink url="/profile" linkName={`profile`}/>
            :<></>}
          {loggedIn === "yes"
            ? <NavLink linkName={`logout`}/>
            : <NavLink url="/account" linkName={`register / login`}/>}
        </ul>
      </div> 
    );
};

export default MenuContents;