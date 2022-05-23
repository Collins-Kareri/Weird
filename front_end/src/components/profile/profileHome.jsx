import UserDetails from "../commonElements/usrDetails";
import Tab from "../commonElements/tab";
import NoContent from "../commonElements/noContent";
import LoggedInCheck from "../hoc/loggedInRoutes";
import { useState,useEffect } from "react";

function ProfileHome() {

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
            <UserDetails userName={userData.userName} userEmail={userData.email} profileImgUrl={false} explore={false}/>
            <Tab handleClick={handleClick} active={active}/>
            <NoContent displayMsg={active==="photos"?"Haven't uploaded any images yet":"Haven't created a collection yet"}/>
        </>
    );
};

export default LoggedInCheck(ProfileHome);