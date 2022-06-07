import Button from "components/commonElements/button";
import {useReducer,useEffect} from "react";
import ProfilePicEdit from "components/profile/uiElements/editElements/profilePicEdit";
import UserDetailsEdit from "components/profile/uiElements/editElements/userDetailsEdit";

function reducer(currentState,action){
    switch(action.type){
        case("init"):
            const {userName,email}=JSON.parse(window.localStorage.getItem("userData"));
            return {...currentState,userName,email,currentPublicId:action.payload.currentPublicId}; 
        case("userNameChange"):
            return {...currentState,userName:action.payload};
        case("emailChange"):
            return {...currentState,email:action.payload};
        case("msg"):
            return {...currentState,msg:action.payload};
        case("publicId"):
            return {...currentState,currentPublicId:action.payload.currentPublicId};
        default:
            return currentState;
    }
}

function ProfileEdit({profilePic,checkForPublicId,toggleEdit,setProfilePic}) {

    const [currentState,dispatch]=useReducer(reducer,{userName:"",email:"",msg:"",currentPublicId:""});

    // useEffect(()=>{
    //      if(currentState.msg.length<=0)
    //     { dispatch({type:"init",payload:profilePic.publicID}) }
    //     if(currentState.msg.toLowerCase()==="saved")
    //     {
    //         setProfilePic(currentState.currentPublicId)
    //     }
    // },[currentState.msg])

    return ( 
        <div id="profileEditContent">
            <Button btnClassName={"tertiary"} btnId={"backProfile"} btnDisplayText={"back"} btnClick={toggleEdit}/>
            <ProfilePicEdit profilePic={profilePic} checkForPublicId={checkForPublicId} currentState={currentState} dispatch={dispatch}/>
            <UserDetailsEdit currentState={currentState} dispatch={dispatch}/>
        </div>
     );
}

export default ProfileEdit;