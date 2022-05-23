import RemoveIcon from "./close.svg";

function PreviewSelected({setImages,images}) {
    function deleteImg(imageName){
        const RESULTS=images.filter(({_,name})=>{
            return name!==imageName
        });

        setImages(RESULTS);
    }
    
    return (
        <>
            {images.map((image)=>{
             return(<div id="imagePreviewContainer" key={image.name}>
                        <span className="removeBtn"  onClick={()=>{deleteImg(image.name)}}></span>
                        <img src={image.url} alt="user generated"/>
                    </div>)
            })}

            <style>
                {
                    `
                    #imagesContainer>#imagePreviewContainer>.removeBtn{
                        background-image:url(${RemoveIcon});
                    }
                    `
                }
            </style>
        </>
     );
}

export default PreviewSelected;