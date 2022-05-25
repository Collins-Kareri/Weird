import NoContent from "../../commonElements/noContent";

function CollectionsContainer({collectionsArr}) {
    return ( 
        <div id="collectionDisplay">
            <NoContent displayMsg="Haven't created a collection yet"/>
        </div>
     );
}

export default CollectionsContainer;