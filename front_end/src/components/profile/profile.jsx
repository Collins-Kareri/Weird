import {useState} from "react";
import Home from "./profileContents/pageViews/home";
import Edit from "./profileContents/pageViews/edit";
import LoggedInCheck from "../hoc/loggedInRoutes";

function Profile() {

    const [editActive,setEditActive]=useState(false);

    function getProfilePic(){}

    function toggleEdit(){
        setEditActive(!editActive);
    }

    return ( 
        <>
            {editActive?<Edit toggleEdit={toggleEdit}/>:<Home toggleEdit={toggleEdit}/>} 
        </>
     );
}

export default LoggedInCheck(Profile);