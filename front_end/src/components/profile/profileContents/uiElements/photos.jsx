import NoContent from "../../../commonElements/noContent";
import Image from "../../../commonElements/image";
import Masonry from "react-masonry-css";

function PhotosContainer({imagesArr,setModalStatus,setAssetUrl,setAssetTags}) {

    const breakpointColumnsObj = {
        default: 3,
        1000: 2,
        500: 1
    };

    function openEditPopUp(public_id,tags){
        setModalStatus("open");
        setAssetUrl(public_id);
        setAssetTags(tags);
        return;
    }

    //we display the images if a available if not display a msg
    return (
        <Masonry
        breakpointCols={breakpointColumnsObj}
        className="photosContainer"
        columnClassName="photo-column">
            {Array.isArray(imagesArr)&&imagesArr.length>0?imagesArr.map(({public_id,name,description,tags})=>{
                return <Image 
                        action={()=>{openEditPopUp(public_id,tags)}} 
                        public_id={public_id} 
                        key={name} 
                        containerType="profile"
                        description={description?description:""}/>
            }):<NoContent displayMsg="Haven't uploaded any images yet"/>}
        </Masonry>
     );
}

export default PhotosContainer;