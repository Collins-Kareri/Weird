import Button from "components/commonElements/button";
import {useReducer,useEffect} from "react";
import ProfilePicEdit from "components/profile/uiElements/editElements/profilePicEdit";
import UserDetailsEdit from "components/profile/uiElements/editElements/userDetailsEdit";

function reducer(currentState,action){
    switch(action.type){
        case("init"):
            if(currentState.msg.toLowerCase() !== "changed")
            {
                return {...currentState,currentPublicId:action.payload};
            }else{
                return currentState;
            } 
        case("userNameChange"):
            return {...currentState,userName:action.payload};
        case("emailChange"):
            return {...currentState,email:action.payload};
        case("msg"):
            return {...currentState,msg:action.payload};
        case("publicID"):
            return {...currentState,currentPublicId:action.payload};
        default:
            return currentState;
    }
}

function ProfileEdit({profilePic,userData,checkForPublicId,toggleEdit,setProfilePic}) {

    const [currentState,dispatch]=useReducer(reducer,{userName:userData.userName,email:userData.email,msg:"",currentPublicId:""});

    useEffect(()=>{

        dispatch({type:"init",payload:profilePic.publicID});

        if(currentState.msg.toLowerCase()==="saved")
        { 
            setProfilePic(prevState=>{return {...prevState,publicID:currentState.currentPublicId} });
            dispatch({type:"msg",payload:"changed"});
            console.log(profilePic); 
        }
    },[currentState.msg])

    return ( 
        <div id="profileEditContent">
            <Button btnClassName={"tertiary"} btnId={"backProfile"} btnDisplayText={"back"} btnClick={toggleEdit}/>
            <ProfilePicEdit profilePic={profilePic} checkForPublicId={checkForPublicId} currentState={currentState} dispatch={dispatch}/>
            <UserDetailsEdit currentState={currentState} dispatch={dispatch}/>
        </div>
     );
}

export default ProfileEdit;