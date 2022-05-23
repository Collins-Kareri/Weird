function Loading({loading}) {

    if(loading==="no"){
        return null;
    };

    return ( 
        <section id="loadingContents">
            <div id="loadingSpinnerContainer">
                <div id="loadingSpinner"></div>
                <p id="loaderMsg">Please wait</p>
            </div>
        </section>
    );
}

export default Loading;