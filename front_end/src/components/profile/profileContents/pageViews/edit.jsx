import InputContainer from "../../../commonElements/inputContainer";
import Button from "../../../commonElements/button";
import {useReducer,useEffect,useRef} from "react";
import {AdvancedImage} from "@cloudinary/react";
import {makeReq,saveToClientStorage,handleFileData,generateSignature, sendToCloudinary,saveProfilePic} from "../../../../util";

function reducer(currentState,action){
    switch(action.type){
        case("init"):
            const {userName,email}=JSON.parse(window.localStorage.getItem("userData"));
            return {...currentState,userName,email}; 
        case("userNameChange"):
            return {...currentState,userName:action.payload};
        case("emailChange"):
            return {...currentState,email:action.payload};
        case("results"):
            return {...currentState,results:action.payload};
        case("msg"):
            return {...currentState,msg:action.payload};
        default:
            return currentState;
    }
}

function ProfileEdit({profilePic,toggleEdit,setProfilePic}) {

    const imgInput=useRef(null);
    const [currentState,dispatch]=useReducer(reducer,{userName:"",email:"",results:[],msg:""});


    function setResults(res){
        dispatch({type:"results",payload:res});
        return;
    }

    function setMsg(res){
        dispatch({type:"msg",payload:res});
        return;
    }

    useEffect(()=>{
        dispatch({type:"init"});
        if(currentState.results.length>0 && currentState.msg === "changed"){
            saveProfilePic(currentState.results,setMsg)
        }

        if(currentState.msg.toLowerCase() === "saved")
        {
            setProfilePic(currentState.results[0].public_id)
        }
        return ()=>{}
    },[currentState.results, currentState.msg, setProfilePic]);

    function profilePictureEdit(evt){
        evt.preventDefault();
        imgInput.current.click();
        return;
    }

    async function handle_User_Credentials_Submit(evt){
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
                const res= await makeReq("updateUserCredentials","put",{data:{userName,updatedCredentials:{userName:currentState.userName, email:currentState.email}}});
                
                const {msg,data}=JSON.parse(res);

                if(msg.toLowerCase() === "successfully updated")
                {
                    alert("Successfully updated.")
                    saveToClientStorage("localStorage",[{key:"userData",value:JSON.stringify(data)}]);
                }

                if(msg.toLowerCase() === "username already exists")
                {
                    alert("Couldn't update your credentials as user name you picked already exists.")
                    dispatch({type:"init"})
                }

                if(msg.toLowerCase()==="Not updated")
                {
                    alert("Didn't update data.");
                    dispatch({type:"init"});
                }
            }
        }

        return;
    }

    async function profile_Pic_On_Change(evt){
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
        sendToCloudinary(REQ_DATA)
    }

    function user_Credentials_On_Change(evt){
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
                    <span 
                        className="profileImg"
                        style={{backgroundImage:`url(${Boolean(profilePic)?"/icons/profilePicturePlaceholder.svg":""})`}}>
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
            <form onSubmit={handle_User_Credentials_Submit} id="usrDetailsEdit">
                <h3>EDIT PROFILE</h3>
                <InputContainer 
                    inputName={"userName"} 
                    inputType={"text"}
                    inputValue={currentState.userName} 
                    labelContent="username"
                    onChange={user_Credentials_On_Change}/>
                <InputContainer 
                    inputName={"email"} 
                    inputType={"text"}
                    inputValue={currentState.email}  
                    labelContent="email"
                    onChange={user_Credentials_On_Change}/>
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