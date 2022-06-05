import UserDetails from "../../../commonElements/usrDetails";
import Tab from "../../../commonElements/tab";
import PhotosContainer from ".././uiElements/photos";
import CollectionsContainer from ".././uiElements/collections";
import {makeReq} from "../../../../util"
import { useState,useEffect } from "react";
import EditPhotosModal from "../uiElements/editPhotosModal";

function ProfileHome({toggleEdit,imagesArr,setImagesArr,userData,profilePic}) {

    const [active,setActive]=useState("photos");
    const [collectionsArr,setCollectionsArr]=useState([]);
    const [modalStatus,setModalStatus]=useState("close");
    const [assetResource,setAssetResource]=useState({imgURL:"",tags:[],public_id:""});
    const ARR_OF_TABS=[{outputName:"photos",active:true},{outputName:"collections",active:false}];

    // async function fetchCollections(userName){
    //     //fetches the collections associated with this user
    // }

    return ( 
        <>
            <UserDetails userName={userData.userName} userEmail={userData.email} profilePic={profilePic} explore={false} toggleEdit={toggleEdit}/>
            <Tab arr_of_tabs={ARR_OF_TABS} setActive={setActive}/>
            <div id="profileContentContainer">
                {active==="photos"?<PhotosContainer imagesArr={imagesArr} setImagesArr={setImagesArr} setModalStatus={setModalStatus} setAssetResource={setAssetResource}/>:<CollectionsContainer collectionsArr={collectionsArr}/>}
            </div>
            <EditPhotosModal setModalStatus={setModalStatus} modalStatus={modalStatus} assetResource={assetResource} setImagesArr={setImagesArr} imagesArr={imagesArr}/>
        </>
    );
};

export default ProfileHome;