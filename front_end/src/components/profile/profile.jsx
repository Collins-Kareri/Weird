import {useState,useEffect} from "react";
import {makeReq} from "util"
import Home from "components/profile/pageViews/home";
import Edit from "components/profile/pageViews/edit";
import LoggedInCheck from "components/hoc/loggedInRoutes";
import {Cloudinary} from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";

function Profile() {

    const [editActive,setEditActive]=useState(false);
    const [imagesArr,setImagesArr]=useState([]);
    const [profile_pic,setProfilePic]=useState({publicID:""});
    const [fetchStatus,setFetchStatus]=useState(null);
    const [userData,setUserData]=useState(()=>{
        let initVal=JSON.parse(localStorage.getItem("userData")) || {userName:"not defined",email:"not defined"} ;
        return initVal;
    });

    function checkForPublicId(){
        return (Boolean(profile_pic.publicID))?true:false;
    }

    function cloudinaryImg(){
        if( Boolean(profile_pic) )
        {
            const cld = new Cloudinary({
                cloud: {
                  cloudName: 'karerisspace'
                }
            });
            
            const myProfilePic=cld.image(profile_pic.publicID);
        
            myProfilePic.resize(scale().width(512).height(512));
            return myProfilePic;
        }

        return profile_pic;
    }

    useEffect(()=>{
        window.addEventListener("storage",()=>{
            setUserData(JSON.parse(localStorage.getItem("userData")));
        });

        const func=async()=>{
            const {data,msg}=await fetchPhotos(userData.userName);
            if(imagesArr.length===0 && userData.userName !== "not defined" && msg === "retrieved" )
            {
                setFetchStatus(msg);
                setProfilePic({publicID:data.profile_pic});
                setImagesArr(data.imagesArr);
            }
        }

        if(fetchStatus !== "retrieved")
        {
            func();
        }

        return ()=>{};
    },[fetchStatus, imagesArr.length, userData.userName]);

    function toggleEdit(){
        setEditActive(!editActive);
    }

    //fetch images this user has uploaded
    async function fetchPhotos(userName){
        //the objects in the image arr will contain public_url,name & description;
        const RESULTS=JSON.parse( await makeReq(`/retrieveImages?userName=${userName}`,"get") );
        return RESULTS;
    }

    return ( 
        <>
            {editActive?<Edit toggleEdit={toggleEdit} userData={userData} profilePic={cloudinaryImg()} setProfilePic={setProfilePic} checkForPublicId={checkForPublicId()}/>:<Home toggleEdit={toggleEdit} imagesArr={imagesArr} setImagesArr={setImagesArr} userData={userData} profilePic={cloudinaryImg()} checkForPublicId={checkForPublicId()}/>} 
        </>
     );
}

export default LoggedInCheck(Profile);