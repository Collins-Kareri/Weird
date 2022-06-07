import UserDetails from "components/commonElements/usrDetails";
import Tab from "components/commonElements/tab";
import PhotosContainer from "components/profile/uiElements/homeElements/photos";
import CollectionsContainer from "components/profile/uiElements/homeElements/collections";
import {makeReq} from "util"
import { useState} from "react";
import EditPhotosModal from "components/profile/uiElements/homeElements/editPhotosModal";

function ProfileHome({toggleEdit,imagesArr,checkForPublicId,setImagesArr,userData,profilePic}) {

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
            <UserDetails userName={userData.userName} checkForPublicId={checkForPublicId} userEmail={userData.email} profilePic={profilePic} explore={false} toggleEdit={toggleEdit}/>
            <Tab arr_of_tabs={ARR_OF_TABS} setActive={setActive}/>
            <div id="profileContentContainer">
                {active==="photos"?<PhotosContainer imagesArr={imagesArr} setImagesArr={setImagesArr} setModalStatus={setModalStatus} setAssetResource={setAssetResource}/>:<CollectionsContainer collectionsArr={collectionsArr}/>}
            </div>
            <EditPhotosModal setModalStatus={setModalStatus} modalStatus={modalStatus} assetResource={assetResource} setImagesArr={setImagesArr} imagesArr={imagesArr}/>
        </>
    );
};

export default ProfileHome;