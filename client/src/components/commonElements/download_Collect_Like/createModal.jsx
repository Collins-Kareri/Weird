import Button from "components/commonElements/button";

function CreateModal({toggleModal_State}) {

    function handleSubmit(evt){
        evt.preventDefault();
    }

    return (
        <>
            <form className="modalContainer createCollectionModal">
                <section className="createCollection">
                    <div className="top">
                        <Button btnClassName={"tertiary"} btnDisplayText="close" btnClick={()=>{toggleModal_State("createCollection")}} btnType="button"/>
                        <Button btnClassName={"secondary"} btnDisplayText="create collection" btnType="submit" btnClick={handleSubmit}/>
                    </div>
                    <input type="text" placeholder="collection name"/>
                    <textarea placeholder="collection description"/>
                </section>
            </form>
            <style>
                {
                    `
                        .createCollection{
                            display:block;
                            position:absolute;
                            top:10%;
                            width:90%;
                            background-color:white;
                            padding:15px;
                            border-radius:8px;
                            height:fit-content;
                            font-family:quicksand,sans-serif;
                        }
                        .createCollection .top{
                            display:flex;
                            position:relative;
                            width:100%;
                            flex-direction:row;
                            align-items:center;
                            justify-content:space-between;
                            margin-bottom:15px;
                        }
                        .createCollection input{
                            margin-bottom:15px;
                        }
                    `
                }
            </style>
        </> 
     );
}

export default CreateModal;