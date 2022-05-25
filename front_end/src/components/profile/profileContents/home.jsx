import UserDetails from "../../commonElements/usrDetails";
import Tab from "../../commonElements/tab";
import NoContent from "../../commonElements/noContent";
import { useState,useEffect } from "react";

function ProfileHome({toggleEdit}) {

    const [userData,setuserData]=useState({userName:"not defined",email:"not defined"});

    const [active,setActive]=useState("photos");

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
                <NoContent displayMsg={active==="photos"?"Haven't uploaded any images yet":"Haven't created a collection yet"}/>
            </div>
        </>
    );
};

export default ProfileHome;