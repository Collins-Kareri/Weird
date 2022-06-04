import InputContainer from "../../../commonElements/inputContainer";
import Button from "../../../commonElements/button";
import {useReducer,useEffect} from "react";
import {makeReq,saveToClientStorage} from "../../../../util";

function ProfileEdit({profileImgUrl,toggleEdit}) {

    function reducer(currentState,action){
        switch(action.type){
            case("init"):
                const {userName,email}=JSON.parse(window.localStorage.getItem("userData"));
                return {userName,email}; 
            case("userNameChange"):
                return {...currentState,userName:action.payload};
            case("emailChange"):
                return {...currentState,email:action.payload};
            default:
                return currentState;
        }
    }

    const [currentState,dispatch]=useReducer(reducer,{userName:"",email:""});

    useEffect(()=>{
        dispatch({type:"init"});
        return ()=>{}
    },[])

    function profilePictureEdit(evt){
        evt.preventDefault();
    };

    async function handleFormSubmit(evt){
        evt.preventDefault();
        const {userName,email}=JSON.parse(window.localStorage.getItem("userData"));
        function check(){
            if(userName !== currentState.userName)
            {
                return true
            }

            if(email !== currentState.email)
            {
                return true;
            }

            return false;
        }

        if(check())
        {
            let updateConfirmation=window.confirm("You are about to update your credentials.");

            if(updateConfirmation)
            {
                const res= await makeReq("updateUserCredentials","put",{data:{userName,updatedCredentials:currentState}})
                console.log(res);
                const {msg,data}=JSON.parse(res);

                if(msg.toLowerCase() === "successfully updated")
                {
                    saveToClientStorage("localStorage",[{key:"userData",value:JSON.stringify(data)}]);
                }
            }
        }
        console.log(evt);
    };

    function onChange(evt){
        let value=evt.target.value;
        let name=evt.target.name;
        dispatch({type:`${name}Change`,payload:value});
    }

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
            <form onSubmit={handleFormSubmit} id="usrDetailsEdit">
                <h3>EDIT PROFILE</h3>
                <InputContainer 
                    inputName={"userName"} 
                    inputType={"text"}
                    inputValue={currentState.userName} 
                    labelContent="username"
                    onChange={onChange}/>
                <InputContainer 
                    inputName={"email"} 
                    inputType={"text"}
                    inputValue={currentState.email}  
                    labelContent="email"
                    onChange={onChange}/>
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