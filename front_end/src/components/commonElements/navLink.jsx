import {Link,useNavigate} from "react-router-dom";
import Button from "./button";
import {saveToLocalStorage} from "../../util.js"

function NavLink({url,linkId,linkName,clickHandler}) {

    const redirect=useNavigate();

    function handleLogout(evt){
        evt.preventDefault();   
        let loggedOutUserData={userName:"",email:""};
        saveToLocalStorage([{key:"userData",value:JSON.stringify(loggedOutUserData)},
            {key:"loggedIn",value:"no"}]);
        redirect("/",{replace:true});
    };

    return ( 
        <li>  
            {linkName === "logout"
                ?<Button btnClassName={"tertiary"} btnClick={handleLogout} btnDisplayText={linkName}/>
                :<Link id={linkId?linkId:""} to={url} onClick={clickHandler?clickHandler:()=>{}}>{linkName}</Link>}
        </li>
     );
}

export default NavLink;