import Button from "../commonElements/button";
import {useNavigate} from "react-router-dom";

function UserDetails({userName,userEmail,explore,profileImgUrl}) {

    const redirect=useNavigate();

    function handleFollowBtnClick(){};

    function handleEditBtnClick(evt){
        evt.preventDefault();
        redirect("/profileEdit",{replace:true});
    };

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
                <Button btnClassName={"usrProfileName secondary"} btnDisplayText={explore?"follow":"edit profile"} btnClick={explore?handleFollowBtnClick:handleEditBtnClick}/>
            </div>
        </> 
     );
}

export default UserDetails;