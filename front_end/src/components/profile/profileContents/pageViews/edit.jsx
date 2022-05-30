import InputContainer from "../../../commonElements/inputContainer";
import Button from "../../../commonElements/button";

function ProfileEdit({profileImgUrl,toggleEdit}) {

    const userData=JSON.parse(window.localStorage.getItem("userData"));

    function profilePictureEdit(evt){
        evt.preventDefault();
    };

    async function handleFormSubmit(){
    };

    return ( 
        <div id="profileEditContent">
            <Button 
                btnClassName={"tertiary"}
                btnId={"backProfile"}
                btnDisplayText={"back"}
                btnClick={toggleEdit}/>
            <div id="profilePicEdit">
                <section>
                    <span className="profileImg"
                    style={{backgroundImage:`url(${profileImgUrl?profileImgUrl:"/icons/profilePicturePlaceholder.svg"})`}}></span>

                    <input type="file" accept="image/*" />

                    <Button 
                        btnClassName={"secondary"}
                        btnId={"editProfilePic"} 
                        btnDisplayText={"change picture"}/>
                </section>
                <Button btnClassName={"primary"} btnDisplayText={"delete account"}/>
            </div>
            <form id="usrDetailsEdit">
                <h3>EDIT PROFILE</h3>
                <InputContainer 
                    inputName={"userName"} 
                    inputType={"text"}
                    inputValue={userData.userName} 
                    labelContent="username"/>
                <InputContainer 
                    inputName={"email"} 
                    inputType={"text"}
                    inputValue={userData.email}  
                    labelContent="email"/>
                <Button 
                    btnId={"updateUserDetails"} 
                    btnClassName={"secondary"} 
                    btnDisplayText="update details" 
                    btnType={"submit"}/>
            </form>
        </div>
     );
}

export default ProfileEdit;