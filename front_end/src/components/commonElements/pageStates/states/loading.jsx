function Loading() {
    return (
        <>
            <div className="pageStateContent" id="loadingState">
                <div></div>
                <div></div>
                <span id="loadingMsg">please wait</span>
            </div>

            <style>
                {
                    `
                        #loadingState {
                            width: 120px;
                            height: 120px;
                        }
                        #loadingMsg{
                            display:inline-block;
                            width:fit-content;
                            position:fixed;
                            text-align:center;
                            top:130px;
                            font-family:Quicksand,sans-serif;
                            font-size:larger;
                            font-weight:bold;
                            text-transform:capitalize;
                            color:hsl(0,10%,30%);
                        }
                        #loadingState div {
                            position: fixed;
                            border: 4px solid hsl(0,10%,30%);
                            opacity: 1;
                            border-radius: 50%;
                            animation: loading 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
                        }
                        #loadingState div:nth-child(2) {
                            animation-delay: -0.5s;
                        }
                        @keyframes loading {
                            0% {
                                opacity: 0;
                            }
                            4.9% {
                                opacity: 0;
                            }
                            5% {
                                top: 60px;
                                left: 60px;
                                width: 0;
                                height: 0;
                                opacity: 1;
                            }
                            100% {
                                top: 0px;
                                left: 0px;
                                width: 120px;
                                height: 120px;
                                opacity: 0;
                            }
                        }
                    `
                }
            </style>
        </> 
     );
}

export default Loading;