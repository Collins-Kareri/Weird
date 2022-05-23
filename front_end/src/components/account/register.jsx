import InputContainer from "../commonElements/inputContainer";
import Button from "../commonElements/button";

function Register({toggleHandler,formDataHandler}) {

    return (
        <form 
          id="register" 
          method="post" 
          action="/createAccount" 
          onSubmit={(evt)=>formDataHandler(evt)}
        >
            <h2>REGISTER</h2>

            <InputContainer inputType="text" inputName="userName" labelContent="username" isRequired={true} />

            <InputContainer inputType="email" inputName="email" labelContent="email" isRequired={true}/>

            <InputContainer inputType="password" inputName="password" labelContent="password (min 8 char)" isPasswordContainer={true} isRequired={true}/>

            <Button btnClassName={"primary"} btnDisplayText={"create account"} btnType={"submit"}/>

            <div onClick={toggleHandler} className="additionalActions">
                <p>Already have an account? <span>Login</span> </p>
            </div>

        </form>
     );
};

export default Register;