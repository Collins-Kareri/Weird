import Button from "../../commonElements/button";
import MenuIcon from "./menuIcon";
import {useNavigate} from "react-router-dom";

function Menu() {

    const redirect=useNavigate();

    function handleSubmitClick(){
        const loggedInStatus=window.localStorage.getItem("loggedIn");
        if(typeof typeof loggedInStatus !== "undefined"){
            if(loggedInStatus === "yes"){
                redirect("/submit",{replace:true});
            }else{
                alert("You have to be logged in to submit photos.\nPlease login to your account or register an account.");
            };
        };
    };
    return (<div id="menu">
        <Button btnClassName={"primary"} btnId="menuSubmitBtn" btnDisplayText={"submit photo"} btnClick={handleSubmitClick}/>
        <MenuIcon/>
    </div>);
};

export default Menu;