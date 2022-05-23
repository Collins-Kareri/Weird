import InputContainer from "../commonElements/inputContainer";
import Button from "../commonElements/button";

function Login({toggleHandler,formDataHandler}) {

    return ( 
        <form 
            action="/createSession" 
            method="post"  
            onSubmit={formDataHandler} 
            id="login"
        >
            <h2>LOGIN</h2>

                <InputContainer inputType="text" inputName="userName" labelContent="username" isRequired={true} />

                <InputContainer inputType="password" inputName="password" labelContent="password" isPasswordContainer={true} isRequired={true}/>

                <Button btnClassName={"primary"} btnDisplayText={"login"}/>

                <div onClick={toggleHandler} className="additionalActions">
                    <p>Don't have an account? <span>Register</span> </p>
                </div>

        </form>
     );
};

export default Login;