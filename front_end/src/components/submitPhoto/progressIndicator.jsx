function ProgressIndicator({progress}) {

    // if(progress===100){
    //     alert("we finished")
    // }

    //when the progress hit a hundred send them to the profile to check out the generate image tags.
    return ( 
        <div id="progressIndicatorContainer">
            <span
            id="progressIndicator"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            >{progress<100?`${progress}%`:"done"}</span>
            <style>
                {
                    `
                        #progressIndicatorContainer{
                            display:${progress>0&&isFinite(progress)?"flex":"none"};
                            opacity:${progress>0&&isFinite(progress)?"1":"0"}
                        }

                        #progressIndicator:before{
                            background: conic-gradient(
                                hsla(5,0%,30%,1) ${progress}%,
                                hsla(1,0%,70%,0.6) ${progress}% 100%
                            );
                        }
                    `
                }
            </style>
        </div>
     );
}

export default ProgressIndicator;