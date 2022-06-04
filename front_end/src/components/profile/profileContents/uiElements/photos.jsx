import NoContent from "../../../commonElements/noContent";
import Image from "../../../commonElements/image";
import {makeReq} from "../../../../util"
import Masonry from "react-masonry-css";

function PhotosContainer({imagesArr,setImagesArr,setModalStatus,setAssetResource}) {

    const breakpointColumnsObj = {
        default: 3,
        1000: 2,
        500: 1
    };

    function openEditPopUp(imgURL,public_id,tags,description){
        setModalStatus("open");
        setAssetResource({imgURL,public_id,tags,description});
        return;
    }

    async function deleteImg(public_id){
        if(window.confirm("You are about to delete an image."))
        {
            let {msg}=JSON.parse(await makeReq("deleteImg","delete",{data:{public_id}}) );

            let newImgArr=imagesArr.filter((val)=>{
                return val.public_id !== public_id;
            });

            if(msg === "ok")
            {
                setImagesArr(newImgArr);
                alert("Successfully deleted");
            }

            if(msg === "not deleted")
            {
                alert("couldn't delete image.")
            }
            
            return;
        }
        return; 
    }

    //we display the images if a available if not display a msg
    return (
        <Masonry
        breakpointCols={breakpointColumnsObj}
        className="photosContainer"
        columnClassName="photo-column">
            {Array.isArray(imagesArr)&&imagesArr.length>0?imagesArr.map(({public_id,imgURL,name,description,tags})=>{
                return <Image
                        deleteAction={()=>{deleteImg(public_id)}}
                        editAction={()=>{openEditPopUp(imgURL,public_id,tags,description)}} 
                        imgURL={imgURL} 
                        key={name} 
                        containerType="profile"
                        description={description}/>
            }):<NoContent displayMsg="Haven't uploaded any images yet"/>}
        </Masonry>
     );
}

export default PhotosContainer;