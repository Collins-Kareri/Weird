import UserDetails from "../../../commonElements/usrDetails";
import Tab from "../../../commonElements/tab";
import PhotosContainer from ".././uiElements/photos";
import CollectionsContainer from ".././uiElements/collections";
import {makeReq} from "../../../../util"
import { useState,useEffect } from "react";
import EditPhotosModal from "../uiElements/editPhotosModal";

function ProfileHome({toggleEdit}) {

    const [userData,setUserData]=useState(()=>{
        let initVal=JSON.parse(localStorage.getItem("userData")) || {userName:"not defined",email:"not defined"} ;
        return initVal;
    }),
        [active,setActive]=useState("photos"),
        [imagesArr,setImagesArr]=useState([]),
        [collectionsArr,setCollectionsArr]=useState([]),
        [fetchStatus,setFetchStatus]=useState(null),
        [modalstatus,setModalStatus]=useState("close"),
        [assetUrl,setAssetUrl]=useState(""),
        [assetTags,setAssetTags]=useState([]),
        TAB_ARR=[{outputName:"photos",active:true},{outputName:"collections",active:false}];
  

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

    // async function fetchCollections(userName){
    //     //fetches the collections associated with this user
    // }


    return ( 
        <>
            <UserDetails userName={userData.userName} userEmail={userData.email} profileImgUrl={false} explore={false} toggleEdit={toggleEdit}/>
            <Tab tab_arr={TAB_ARR} setActive={setActive}/>
            <div id="profileContentContainer">
                {active==="photos"?<PhotosContainer imagesArr={imagesArr} setModalStatus={setModalStatus} setAssetTags={setAssetTags} setAssetUrl={setAssetUrl}/>:<CollectionsContainer collectionsArr={collectionsArr}/>}
            </div>
            <EditPhotosModal setModalStatus={setModalStatus} modalstatus={modalstatus} assetUrl={assetUrl} assetTags={assetTags}/>
        </>
    );
};

export default ProfileHome;