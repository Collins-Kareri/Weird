function ProgressIndicator({progress}) {
    return ( 
        <div id="progressIndicatorContainer">
            <span
            id="progressIndicator"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            >{progress}%</span>
            <style>
                {
                    `
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