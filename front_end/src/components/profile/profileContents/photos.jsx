import NoContent from "../../commonElements/noContent";
import Image from "../../commonElements/image";

function PhotosContainer({imagesArr}) {

    function openEditPopUp(){
    }

    //we display the images if a available if not display a msg
    return (
        <>
            {Array.isArray(imagesArr)&&imagesArr.length>0?imagesArr.map(({public_url,name,description})=>{
                return <Image 
                        action={openEditPopUp} 
                        public_url={public_url} 
                        key={name} 
                        containerType="profile"
                        description={description?description:""}/>
            }):<NoContent displayMsg="Haven't uploaded any images yet"/>}
        </>
     );
}

export default PhotosContainer;