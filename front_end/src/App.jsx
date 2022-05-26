import {BrowserRouter,Routes,Route} from "react-router-dom";
import Header from "./components/header/Header";
import Separator from "./components/commonElements/separator";
import MenuContents from "./components/commonElements/menuContents";
import HomeContents from "./components/home/homeContents";
import CollectionContainer from "./components/collection/collectionContainer";
import Account from "./components/account/account";
import SubmitPageContent from "./components/submitPhoto/submitPageContent";
import Profile from "./components/profile/profile";
import Image from "./components/imagesDisplay/image";
import PageState from "./components/commonElements/pageStates/pageState";
import { useEffect, useState } from "react";

function App() {
  
  const [loggedIn,setLoggedIn]=useState(localStorage.getItem("loggedIn")?localStorage.getItem("loggedIn"):"no");
  const [currentProgress,setCurrentProgress]=useState(0);

  useEffect(()=>{
    window.addEventListener("storage",()=>{
      setLoggedIn(localStorage.getItem("loggedIn"));
    });
  },[loggedIn]);
  
  return (
      <BrowserRouter>
        <PageState currentProgress={currentProgress}/>
        <Header/>  
        <MenuContents loggedIn={loggedIn}/>
        <Separator/>
        <main className="wrapper">
            <Routes>   
              <Route path="/" exact element={<HomeContents/>}/>
              <Route path="/collections" exact element={<CollectionContainer/>}/>
              {/* 
                check if the user if logged in if so a request for the
                log in or register form is redirected to profile page
               */}
              <Route path="/account" exact element={loggedIn==="yes"?<Profile/>:<Account/>}/>
              <Route path="/submit" exact element={<SubmitPageContent setCurrentProgress={setCurrentProgress}/>}/>
              <Route path="/profile" exact element={<Profile/>}/>
              <Route path="/images" exact element={<Image/>}/>
            </Routes>
        </main>
      </BrowserRouter>
  );
};

export default App;
