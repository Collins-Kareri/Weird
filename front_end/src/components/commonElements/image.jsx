import Button from "./button";
import {AdvancedImage,lazyload,placeholder, responsive} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import {scale} from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";

function Image({public_id,containerType,action,description}) {

    const CLD = new Cloudinary({
        cloud: {
          cloudName: 'karerisspace'
        }
    });
    
    const MYIMAGE = CLD.image(public_id);

    MYIMAGE.resize(scale().width(512)).format("auto").quality("auto").roundCorners(byRadius(10));

    return (
        <div className="photo">
            {containerType==="profile"?<Button btnClassName={"secondary"} btnClick={action} btnDisplayText="edit"/>:<></>}
            {containerType==="profile"?<Button btnClassName={"tertiary"} btnClick={action} btnDisplayText="delete"/>:<></>}
            {containerType==="display"?"user profile pic(not clickable) + user_name(clickable)":<></>}
            {/*Pop up for the edit functionality*/}
            {/*container for action you can take i.e edit*/}
            {/*image display*/}
            <AdvancedImage
            cldImg={MYIMAGE} 
            description={description?description:"some user image"}
            plugins={[lazyload(), responsive({steps:300}), placeholder({mode:"predominant"})]}/>
            {containerType==="display"?"download, like and add to collection actions":<></>}
        </div>
    );
}

export default Image;