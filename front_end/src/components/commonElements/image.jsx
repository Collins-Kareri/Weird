import Button from "./button";
function Image({public_id,containerType,action,description}) {

    return (
        <div className="photo">
            {containerType==="profile"?<Button btnClassName={"secondary"} btnClick={action} btnDisplayText="edit"/>:<></>}
            {containerType==="profile"?<Button btnClassName={"tertiary"} btnClick={action} btnDisplayText="delete"/>:<></>}
            {containerType==="display"?"user profile pic(not clickable) + user_name(clickable)":<></>}
            {/*Pop up for the edit functionality*/}
            {/*container for action you can take i.e edit*/}
            {/*image display*/}
            <img src={public_id} alt={description?description:"some user image"} loading="lazy"/>
            {/* <AdvancedImage
            cldImg={MYIMAGE} 
            description={description?description:"some user image"}
            plugins={[lazyload(), responsive({steps:300}), placeholder({mode:"predominant"})]}/> */}
            {containerType==="display"?"download, like and add to collection actions":<></>}
        </div>
    );
}

export default Image;