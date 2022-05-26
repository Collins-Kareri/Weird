function Progress({currentProgress}) {
    return ( 
        <>
            <div className="pageStateContent" id="progressContainer">
               <span id="number">{currentProgress}%</span>
            </div>

            <style>
                {
                    `
                        #progressContainer{
                            width:fit-content;
                            height:fit-content;
                        }

                        #progressContainer>#number{
                            display: flex;
                            justify-content: center;
                            align-content: center;
                            flex-wrap: wrap;
                            flex-direction: column;
                            color:hsl(5deg 20% 10%);
                            transition:all 0.5s cubic-bezier(0.5, -0.13, 0.64, 0.76);
                            width: 150px;
                            height: 150px;
                            font-size: xx-large;
                            padding: 30px;
                            border-radius: 50%;
                            background-color:white;
                            box-shadow:inset 1px 1px 4px 1px hsl(5deg 20% 10%);
                        }
                    `
                }
            </style>
        </>
     );
}

export default Progress;