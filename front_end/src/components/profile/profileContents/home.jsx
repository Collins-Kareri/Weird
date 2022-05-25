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
    
    console.log(imagesArr);

    useEffect(()=>{
     return async ()=>{
                let data=JSON.parse(window.localStorage.getItem("userData"));
                if(data){
                    setuserData(data);
                    let imgs=await (await fetchPhotos(data.userName)).json();
                    setImagesArr(imgs.data);
                }
        }
    },[]);

    async function fetchPhotos(userName){
        //fetch images this user has uploaded
        //the objects in the image arr will contain public_url,name & description;
        return await fetch("/retrieveImages",{
            headers:{
                "Req-Name":`user_imgs_${userName}`,
                "Content-Type":"application/json"
            },
            method:"post",
            body:JSON.stringify({userName})
        });
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