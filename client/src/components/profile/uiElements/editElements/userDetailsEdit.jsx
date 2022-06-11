import InputContainer from "components/commonElements/inputContainer";
import Button from "components/commonElements/button";
import {makeReq,saveToClientStorage} from "util";

function UserDetailsEdit({currentState,dispatch}) {

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

    function user_Credentials_On_Change(evt){
        let value=evt.target.value;
        let name=evt.target.name;
        dispatch({type:`${name}Change`,payload:value});
    }

    return ( 
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
     );
}

export default UserDetailsEdit;