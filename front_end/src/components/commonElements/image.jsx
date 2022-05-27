import Button from "./button";
import {AdvancedImage,lazyload,placeholder} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import {fill} from "@cloudinary/url-gen/actions/resize";
import MagicGrid from "magic-grid";

function Image({public_id,noOfImgs,containerType,action,description}) {

    const CLD = new Cloudinary({
        cloud: {
          cloudName: 'karerisspace'
        }
    });
    
    const MYIMAGE = CLD.image(public_id);

    MYIMAGE.resize(fill().width(300)).format("auto").quality("auto");

    function onLoad(){
        let magicGrid = new MagicGrid({
            container: "#profileContentContainer", // Required. Can be a class, id, or an HTMLElement.
            items: noOfImgs,
            gutter: 30
        });

        magicGrid.listen();
        magicGrid.positionItems(); 
    }

    return (
        <div className="photoContainer">
            {containerType==="profile"?<Button btnClassName={"tertiary"} btnClick={action} btnDisplayText="edit"/>:<></>}
            {containerType==="display"?"user profile pic(not clickable) + user_name(clickable)":<></>}
            {/*Pop up for the edit functionality*/}
            {/*container for action you can take i.e edit*/}
            {/*image display*/}
            <AdvancedImage onLoad={onLoad} cldImg={MYIMAGE} description={description?description:"some user image"}
            plugins={[lazyload(), placeholder({mode:"predominant"})]}/>
            {containerType==="display"?"download, like and add to collection actions":<></>}
        </div>
    );
}

export default Image;