import NoContent from "../../commonElements/noContent";
import Image from "../../commonElements/image";

function PhotosContainer({imagesArr}) {

    function openEditPopUp(){
    }


    //we display the images if a available if not display a msg
    return (
        <>
            {Array.isArray(imagesArr)&&imagesArr.length>0?imagesArr.map(({public_id,name,description})=>{
                return <Image 
                        action={openEditPopUp} 
                        public_id={public_id} 
                        key={name} 
                        containerType="profile"
                        noOfImgs={imagesArr.length}
                        description={description?description:""}/>
            }):<NoContent displayMsg="Haven't uploaded any images yet"/>}
        </>
     );
}

export default PhotosContainer;