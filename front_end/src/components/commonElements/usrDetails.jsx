import Button from "../commonElements/button";
import {useNavigate} from "react-router-dom";
import {AdvancedImage} from "@cloudinary/react";

function UserDetails({userName,userEmail,explore,profilePic,toggleEdit}) {

    const redirect=useNavigate();

    function handleFollowBtnClick(){};

    console.log(profilePic);

    return (
        <>
            <div className="usrDetails">
                <section>
                    <span 
                        className="profileImg"
                        style={{backgroundImage:`url(${Boolean(profilePic)?"/icons/profilePicturePlaceholder.svg":""})`}}
                    >
                        {Boolean(profilePic)?<AdvancedImage cldImg={profilePic}/>:<></>}
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