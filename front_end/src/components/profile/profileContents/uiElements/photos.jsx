import NoContent from "../../../commonElements/noContent";
import Image from "../../../commonElements/image";
import Masonry from "react-masonry-css";

function PhotosContainer({imagesArr,setModalStatus}) {

    const breakpointColumnsObj = {
        default: 3,
        900: 2,
        500: 1
    };

    function openEditPopUp(){
        setModalStatus("open");
        return;
    }

    //we display the images if a available if not display a msg
    return (
        <Masonry
        breakpointCols={breakpointColumnsObj}
        className="photosContainer"
        columnClassName="photo-column">
            {Array.isArray(imagesArr)&&imagesArr.length>0?imagesArr.map(({public_id,name,description})=>{
                return <Image 
                        action={openEditPopUp} 
                        public_id={public_id} 
                        key={name} 
                        containerType="profile"
                        description={description?description:""}/>
            }):<NoContent displayMsg="Haven't uploaded any images yet"/>}
        </Masonry>
     );
}

export default PhotosContainer;