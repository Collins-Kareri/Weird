import Button from "./button";

function Image({imgURL,containerType,editAction,deleteAction,description}) {

    return (
        <div className="photo">
            {containerType==="profile"?<Button btnClassName={"secondary"} btnClick={editAction} btnDisplayText="edit"/>:<></>}
            {containerType==="profile"?<Button btnClassName={"tertiary"} btnClick={deleteAction} btnDisplayText="delete"/>:<></>}
            {containerType==="display"?"user profile pic(not clickable) + user_name(clickable)":<></>}
            {/*Pop up for the edit functionality*/}
            {/*container for action you can take i.e edit*/}
            {/*image display*/}
            <img src={imgURL} alt={description?description:"some user image"} loading="lazy"/>
            {/* <AdvancedImage
            cldImg={MYIMAGE} 
            description={description?description:"some user image"}
            plugins={[lazyload(), responsive({steps:300}), placeholder({mode:"predominant"})]}/> */}
            {containerType==="display"?"download, like and add to collection actions":<></>}
        </div>
    );
}

export default Image;