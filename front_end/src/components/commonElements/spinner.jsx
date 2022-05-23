function Spinner({progress}) {
    
    const dimensions="80px",
        mainColor="hsla(1,0%,30%,1)";

    return ( 
        <>
            <section id="spinnerContainer">
                <div id="innerWidth">
                    <span>{progress}%</span>
                </div>
            </section>
            <style>
                {
                    `
                        #spinnerContainer{
                            position:absolute;
                            z-index:3;
                            top:0px;
                            left:0;
                            width:100vw;
                            height:100vh;
                            background-color:hsla(0,0%,20%,0.5);
                        }
                        #innerWidth{
                            display:inline-block;
                            position:absolute;
                            top: 50%;
                            left: 50%;
                            transform:translate(-50%,-50%);
                            margin:15px;
                            height:${dimensions};
                            width:${dimensions};
                            border-radius:50%; 
                        }

                        #innerWidth>span{
                            display:inline-block;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform:translate(-50%,-50%);
                            width:fit-content;
                            height:fit-content;
                        }

                        #innerWidth::after{
                            content:"";
                            display:block;
                            border-radius:50%;
                            height:74px;
                            width:74px;
                            border-width:2px;
                            border-style:solid;
                            border-color:${mainColor};
                            border-bottom-color:transparent;
                            border-right-color:transparent;
                            animation:spinner-dual-ring 1.5s linear infinite;
                            top:0;
                        }

                        @keyframes spinner-dual-ring{
                            0%{
                                transform:rotate(0deg);
                            }
                            100%{
                                transform:rotate(360deg);
                            }
                        }
                    `
                }
            </style>
        </>
     );
}

export default Spinner;