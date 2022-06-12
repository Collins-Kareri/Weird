import Button from "components/commonElements/button";
import NoContent from "components/commonElements/noContent";

function CollectModal({toggleModal_State, collections}) {

    return (
        <>
            <div className="modalContainer collectionModal">
                <section className="collectionModalItems">
                    <div className="top">
                        <Button btnClassName={"tertiary close_Btn"} btnClick={()=>{return toggleModal_State("collection")} }btnDisplayText={"close"}/>
                        <Button btnClassName={"secondary"} btnDisplayText="new collection" btnClick={()=>{return toggleModal_State("createCollection")}}/>
                    </div>
                    <h2>Collections</h2>
                    <div data-within="collections">
                        {collections.length>0?collections.map(
                            ({name,noOfItems,id})=>{
                            return (<section key={id}>
                                        <h4>{name}</h4>
                                        <span>{noOfItems}</span>
                                        <button className="secondary">add</button>
                                    </section>)
                            }
                        ):<NoContent displayMsg="No collections"/>}
                    </div>
                </section>
            </div>

            <style>
                {`
                    .collectionModalItems{
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
                    .collectionModalItems .top{
                        display:flex;
                        position:relative;
                        width:100%;
                        flex-direction:row;
                        align-items:center;
                        justify-content:space-between;
                    }
                    .collectionModalItems div[data-within="collections"]{
                        padding:5px 15px;
                        height:300px;
                        overflow-y:auto;
                    }
                    .collectionModalItems div[data-within="collections"]>section{
                        display:flex;
                        position:relative;
                        flex-direction: column;
                        justify-content: space-evenly;
                        align-items: flex-start;
                        width:100%;
                        background-color:hsl(1,20%,90%);
                        margin-bottom:15px;
                        height:150px;
                        border-radius:8px;
                        padding:15px;
                    }

                    .collectionModalItems div[data-within="collections"]>section>h4{
                        margin:0px;
                    }
                `}
            </style>
        </> 
     );
}

export default CollectModal;