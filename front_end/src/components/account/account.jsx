import { useState} from "react";
import { useNavigate} from "react-router-dom";
import Register from "./register";
import Login from "./login";
import {saveToLocalStorage} from "../../util.js"

function Account({isLoading}) {
    const redirect=useNavigate(),
        [registerUiActiveStatus,setRegisterUiActiveStatus]=useState(true);

    function handleResults(parsedRes)
    {
        isLoading("no");
        let msg=parsedRes.msg;
        if(msg === "Log in successful" || msg === "Account created successfully")
        {
           
            const USERDATA=parsedRes.userData;

            saveToLocalStorage([{key:"userData",value:JSON.stringify(USERDATA)},
            {key:"loggedIn",value:"yes"}]);

            //redirect to profile page on successful log in or register
            redirect("/profile",{replace:true});
            return;
        };

        if(msg === "Username already exists")
        {
            alert("Username already exists");
            return;
        };

        if(parsedRes.msg === "Wrong username or password. Please try again")
        {
            alert("Wrong username or password");
            return;
        };

        alert(msg);
        return;
    };

    async function handleFormSubmit(evt)
    {
        evt.preventDefault();

        isLoading("yes");

        const data={},
            form=evt.target,
            route=form.action.match(/\/\w+$/g).join(),//because form action returns the full url and we want the path. ie http://host:port/path
            method=form.method.toUpperCase();
        
        for(let el of form.elements)
        {
            if(el.name.length>0)
            {
                data[el.name]=el.value;
            };
        };

        try{
            const response= await fetch(route,
            {
                method:method,
                body:JSON.stringify(data),
                headers:
                {
                    "Content-Type":"application/json",
                    "Req-Name":`${route}_${data.userName}`
                }
            }),
                parsedRes=await response.json();

                handleResults(parsedRes);
        }catch(err){
            console.log(err)
            alert(`Error occured: ${err}`);
        };
    };

    /** 
     * changes the form to log in or to register
    */
    function toggleStatus()
    {
        setRegisterUiActiveStatus(!registerUiActiveStatus);
    };

    return ( 
        <>
            {registerUiActiveStatus?<Register toggleHandler={toggleStatus} formDataHandler={handleFormSubmit}/>
            :<Login toggleHandler={toggleStatus} formDataHandler={handleFormSubmit}/>}
        </>
     );
};

export default Account;