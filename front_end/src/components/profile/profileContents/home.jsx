import UserDetails from "../../commonElements/usrDetails";
import Tab from "../../commonElements/tab";
import PhotosContainer from "./photos";
import CollectionsContainer from "./collections";
import { useState,useEffect } from "react";

function ProfileHome({toggleEdit}) {

    const [userData,setuserData]=useState({userName:"not defined",email:"not defined"}),
        [active,setActive]=useState("photos"),
        [imagesArr,setImagesArr]=useState([]),
        [collectionsArr,setCollectionsArr]=useState([]);

    useEffect(()=>{
        let data=JSON.parse(window.localStorage.getItem("userData"));
        if(data){
            setuserData(data);
        };
    },[]);

    async function fetchPhotos(userName){
        //fetch images this user has uploaded
    };

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