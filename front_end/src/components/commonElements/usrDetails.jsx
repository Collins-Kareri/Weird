import Button from "../commonElements/button";
import {useNavigate} from "react-router-dom";

function UserDetails({userName,userEmail,explore,profileImgUrl,toggleEdit}) {

    const redirect=useNavigate();

    function handleFollowBtnClick(){};

    return (
        <>
            <div className="usrDetails">
                <section>
                    <span 
                        className="profileImg"
                        style={{backgroundImage:`url(${profileImgUrl?profileImgUrl:"/icons/profilePicturePlaceholder.svg"})`}}
                    ></span>
                    <span className="usrName">{userName}</span>
                    <span className="usrEmail">{userEmail}</span>
                </section>
                <Button btnClassName={"usrProfileName secondary"} btnDisplayText={explore?"follow":"edit profile"} btnClick={explore?handleFollowBtnClick:toggleEdit}/>
            </div>
        </> 
     );
}

export default UserDetails;