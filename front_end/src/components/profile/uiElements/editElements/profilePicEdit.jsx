import Button from "components/commonElements/button";
import {AdvancedImage} from "@cloudinary/react";
import {useRef} from "react";
import {makeReq, handleFileData, generateSignature, sendToCloudinary,saveProfilePic} from "util";
import { saveToClientStorage } from "util";

function ProfilePicEdit({profilePic,checkForPublicId,dispatch}) {

    const imgInput=useRef(null);

    function setResults(res){
        dispatch({type:"results",payload:res});
        return;
    }

    function profilePictureEdit(evt){
        if(window.confirm("You are about to change the profile picture"))
        {
            evt.preventDefault();
            imgInput.current.click();
            return;
        }
    }

    async function profile_Pic_On_Change(evt){
        const FILE_DATA=await handleFileData(evt.target.files,false);
        const SIGNATURE_OBJ=await generateSignature({uploadType:"profile"});

        const REQ_DATA={
            file:FILE_DATA[0].url,
            signatureObj:SIGNATURE_OBJ,
            uploadType:"profile",
            noOfValuesToUpload:evt.target.files.length,
            setResults
        }

        sendToCloudinary(REQ_DATA)
        .then((res)=>{
            console.log(res);
            // saveToClientStorage("sessionStorage",[{key:"pageStatus",value:""}]);
            saveProfilePic(res,profilePic,dispatch);
        })
        .catch((err)=>{
            console.log(err);
            alert("Error cannot update your profilePicture");
        })
    }

    async function deleteProfilePic(){
    }

    return (
        <div id="profilePicEdit">
            <section>
                <span 
                className="profileImg"
                style={{position:"relative",backgroundImage:`url(${checkForPublicId?"":"/icons/profilePicturePlaceholder.svg"})`}}>
                    {checkForPublicId?<span className="deleteBtn" onClick={deleteProfilePic}></span>:<></>}
                    {checkForPublicId?<AdvancedImage cldImg={profilePic}/>:<></>}
                </span>
                <input ref={imgInput} type="file" accept="image/*" onChange={profile_Pic_On_Change}/>
                <Button 
                    btnClassName={"secondary"}
                    btnId={"editProfilePic"} 
                    btnDisplayText={"change picture"}
                    btnClick={profilePictureEdit}/>
            </section>
            <Button btnClassName={"primary"} btnDisplayText={"delete account"}/>
        </div>
    );
}

export default ProfilePicEdit;