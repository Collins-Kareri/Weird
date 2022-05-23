import {AdvancedImage} from "@cloudinary/react";
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions and qualifiers.
import {thumbnail} from "@cloudinary/url-gen/actions/resize";

function Image(){

    const cld=new Cloudinary({
        cloud:{
            cloudName:"karerisspace"
        }
    });

    const image=cld.image("weird/wpuafeszpksl2podmqkj");

    console.log(image)

      // Apply the transformation.
    image
    .resize(thumbnail().width(300))

    return (
        <div>
            <AdvancedImage cldImg={image}/>
        </div>
    );
};

export default Image;