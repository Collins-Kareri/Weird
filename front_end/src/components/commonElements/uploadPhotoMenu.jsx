import Button from "./button";

function UploadMenu({openFileBrowseFeature}) {
    return (
        <>
            <div id="uploadMenu">
                <Button btnClick={openFileBrowseFeature} btnClassName={"secondary"} btnType="button" btnDisplayText={"browse files"}/>
                <Button btnClassName={"primary"} btnType="submit" btnDisplayText={"upload photos"}/>
            </div>

            <style>
                {
                    `
                        #uploadMenu{
                            display:flex;
                            width:100%;
                            background-color:white;
                            height:fit-content;
                        }
                        #uploadMenu>.primary{
                            margin-left:15px;
                        }
                    `
                }
            </style>
        </>
      );
}

export default UploadMenu;