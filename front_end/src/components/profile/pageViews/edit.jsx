import Button from "components/commonElements/button";
import {useReducer,useEffect} from "react";
import {saveProfilePic} from "util";
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
        case("results"):
            return {...currentState,results:action.payload};
        case("msg"):
            return {...currentState,msg:action.payload};
        case("change_Current_PublicId"):
            return {...currentState,currentPublicId:action.payload.currentPublicId};
        default:
            return currentState;
    }
}

function ProfileEdit({profilePic,toggleEdit,setProfilePic}) {

    const [currentState,dispatch]=useReducer(reducer,{userName:"",email:"",results:[],msg:"",currentPublicId:""});

    function setMsg(res){
        dispatch({type:"msg",payload:res});
        return;
    }

    useEffect(()=>{
        dispatch({type:"init",payload:{currentPublicId:profilePic.publicID}});
        if(currentState.results.length>0 && currentState.msg === "changed"){
            saveProfilePic(currentState.results,currentState.currentPublicId,setMsg)
        }

        if(currentState.msg.toLowerCase() === "saved")
        {
            setProfilePic(currentState.results[0].public_id);
            dispatch({type:"change_Current_PublicId",payload:{currentPublicId:profilePic.publicID}})
        }

        return ()=>{};
    },[currentState.results, currentState.msg, setProfilePic, profilePic.publicID, currentState.currentPublicId]);

    return ( 
        <div id="profileEditContent">
            <Button btnClassName={"tertiary"} btnId={"backProfile"} btnDisplayText={"back"} btnClick={toggleEdit}/>
            <ProfilePicEdit profilePic={profilePic} dispatch={dispatch}/>
            <UserDetailsEdit currentState={currentState} dispatch={dispatch}/>
        </div>
     );
}

export default ProfileEdit;