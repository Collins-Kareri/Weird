import UserDetails from "../../commonElements/usrDetails";
import Tab from "../../commonElements/tab";
import PhotosContainer from "./photos";
import CollectionsContainer from "./collections";
import {makeReq} from "../../../util"
import { useState,useEffect } from "react";

function ProfileHome({toggleEdit}) {

    const [userData,setUserData]=useState(()=>{
        let initVal=JSON.parse(localStorage.getItem("userData")) || {userName:"not defined",email:"not defined"} ;
        return initVal;
    }),
        [active,setActive]=useState("photos"),
        [imagesArr,setImagesArr]=useState([]),
        [collectionsArr,setCollectionsArr]=useState([]),
        [fetchStatus,setFetchStatus]=useState(null);
  

    useEffect(()=>{
        window.addEventListener("storage",()=>{
            setUserData(JSON.parse(localStorage.getItem("userData")));
        });

        const func=async()=>{
            const {data,msg}=await fetchPhotos(userData.userName);
            if(imagesArr.length===0 && userData.userName !== "not defined" && msg==="retrieved" )
            {
                setFetchStatus(msg)
                setImagesArr(data);
            }
        }

        if(fetchStatus!=="retrieved")
        {
            func();
        }
        return ()=>{};
    },[fetchStatus, imagesArr.length, userData.userName]);
    

    //fetch images this user has uploaded
    async function fetchPhotos(userName){
        //the objects in the image arr will contain public_url,name & description;
        const RESULTS=await makeReq("/retrieveImages","post",{data:{userName}});
        return JSON.parse(RESULTS);
    }

    async function fetchCollections(userName){
        //fetches the collections associated with this user
    }

    function handleClick(evt){
        evt.preventDefault();
        if(evt.target.id==="photosTab"){
            setActive("photos");
        }else if(evt.target.id==="collectionsTab"){
            setActive("collections");
        };
    };

    return ( 
        <>
            <UserDetails userName={userData.userName} userEmail={userData.email} profileImgUrl={false} explore={false} toggleEdit={toggleEdit}/>
            <Tab handleClick={handleClick} active={active}/>
            <div id="profileContentContainer">
                {active==="photos"?<PhotosContainer imagesArr={imagesArr}/>:<CollectionsContainer collectionsArr={collectionsArr}/>}
            </div>
        </>
    );
};

export default ProfileHome;