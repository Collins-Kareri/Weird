import Button from "../button";

function Fail({handleClick}) {

    return ( 
        <>
            <div className="pageStateContent" id="failMsgContainer">
                <span id="failMsg">Couldn't perform your action.Please try again.</span>
                <Button btnClassName={"primary"} btnClick={handleClick} btnDisplayText="ok"/>
            </div>

            <style>
                {
                    `
                        #failMsgContainer{
                            display: flex;
                            flex-direction: column;
                            flex-wrap: wrap;
                            align-items: center;
                            font-size:larger;
                        }

                        #failMsg{
                            text-align:center;
                            margin-bottom:20px;
                        }
                    `
                }
            </style>
        </>
     );
}

export default Fail;