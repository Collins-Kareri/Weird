import Button from "components/commonElements/button";
import {AdvancedImage} from "@cloudinary/react";
import {useRef} from "react";
import {handleFileData,generateSignature, sendToCloudinary} from "util";

function ProfilePicEdit({profilePic,dispatch}) {

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
        if(window.confirm("You are about to change the profile picture"))
        {
            const FILES=evt.target.files,
                profilePicUrl=await handleFileData(FILES,false),
                SIGNATUREOBJ=await generateSignature({uploadType:"profile"});
        
            dispatch({type:"msg",payload:"changed"});

            if(SIGNATUREOBJ === "server error"){
                return;
            }

            const REQ_DATA=
            {
                file:profilePicUrl[0].url,
                identifier:profilePicUrl[0].name,
                noOfValuesToUpload:FILES.length,
                signatureObj:SIGNATUREOBJ,
                uploadType:"profile",
                setResults
            }

            sendToCloudinary(REQ_DATA);
        };
    }

    function deleteProfilePic(evt){
        if(window.confirm("You are about to delete your profile picture."))
        {
        }
        return;
    }

    return (
        <div id="profilePicEdit">
            <section>
                <span 
                className="profileImg"
                style={{position:"relative",backgroundImage:`url(${Boolean(profilePic)?"":"/icons/profilePicturePlaceholder.svg"})`}}>
                    {Boolean(profilePic)?<span className="deleteBtn" onClick={deleteProfilePic}></span>:<></>}
                    {Boolean(profilePic)?<AdvancedImage cldImg={profilePic}/>:<></>}
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