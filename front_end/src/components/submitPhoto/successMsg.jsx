import {useNavigate} from "react-router-dom";
import Button from "../commonElements/button";

function SuccessMsg() {

    const redirect=useNavigate(null);

    function handleClick(){
        redirect("/profile",{replace:true})
    }

    return (
        <div id="successMsgContainer">
            <h1 id="successMsgTitle">Upload successful</h1>
            <p id="successMsg">Thank for uploading.<br/>You will be redirected to your profile where you will edit the auto-generated tags.This will ensure that your images are visible in the categories you intended.</p>
            <Button btnClassName={"primary"} btnClick={handleClick} btnDisplayText={"ok"}/>
        </div> 
     );
}

export default SuccessMsg;