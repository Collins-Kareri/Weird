import Button from "./button";

function Image({public_url,name,containerType,action,description}) {
    return (
        <div key={name} class="photoContainer">
            {containerType==="profile"?<Button btnClassName={"tertiary"} btnClick={action} btnDisplayText="edit"/>:<></>}
            {containerType==="display"?"user profile pic(not clickable) + user_name(clickable)":<></>}
            {/*Pop up for the edit functionality*/}
            {/*container for action you can take i.e edit*/}
            {/*image display*/}
            <img src={public_url} alt={description.length>0?description:"an image from weird site from username"}/>
            {containerType==="display"?"download, like and add to collection actions":<></>}
        </div>
    );
}

export default Image;