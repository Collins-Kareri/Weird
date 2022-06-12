import Button from "./button";
import DOWNLOAD_COLLECT_LIKE from "components/commonElements/download_Collect_Like/index";

function Image({imgURL,containerType,editAction,deleteAction,description}) {

    return (
        <div className="photo">
            <div className="top">
                {containerType==="profile"?<Button btnClassName={"secondary"} btnClick={editAction} btnDisplayText="edit"/>:<></>}
                {containerType==="profile"?<Button btnClassName={"tertiary"} btnClick={deleteAction} btnDisplayText="delete"/>:<></>}
                {containerType==="display"?"user profile pic(not clickable) + user_name(clickable)":<></>}
            </div>
            {/*Pop up for the edit functionality*/}
            {/*container for action you can take i.e edit*/}
            {/*image display*/}
            {imgURL.length>0?<img src={imgURL} alt={description?description:"some user image"} loading="lazy"/>:<></>}
            <div className="bottom">
                <DOWNLOAD_COLLECT_LIKE/>
            </div>
        </div>
    );
}

export default Image;