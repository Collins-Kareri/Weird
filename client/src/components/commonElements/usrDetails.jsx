import Button from "../commonElements/button";
import {AdvancedImage} from "@cloudinary/react";

function UserDetails({userName,userEmail,checkForPublicId,explore,profilePic,toggleEdit}) {

    function handleFollowBtnClick(){};

    return (
        <>
            <div className="usrDetails">
                <section>
                    <span 
                        className="profileImg"
                        style={{backgroundImage:`url(${checkForPublicId?"":"/icons/profilePicturePlaceholder.svg"})`}}
                    >
                        {checkForPublicId?<AdvancedImage cldImg={profilePic}/>:<></>}
                    </span>
                    <span className="usrName">{userName}</span>
                    <span className="usrEmail">{userEmail}</span>
                </section>
                <Button btnClassName={"usrProfileName secondary"} btnDisplayText={explore?"follow":"edit profile"} btnClick={explore?handleFollowBtnClick:toggleEdit}/>
            </div>
        </> 
     );
}

export default UserDetails;