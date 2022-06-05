import Button from "../../button";

function Success({handleClick,msg}) {
    return ( 
        <>
            <div className="pageStateContent" id="successMsgContainer">
                <span id="successMsg">{typeof msg !== "undefined"? msg :"UPLOAD WAS SUCCESSFUL. YOU WILL BE REDIRECTED TO YOUR PROFILE"}</span>
                <Button btnClassName={"primary"} btnClick={handleClick} btnDisplayText="ok"/>
            </div>

            <style>
                {
                    `
                        #successMsgContainer{
                            display: flex;
                            flex-direction: column;
                            flex-wrap: wrap;
                            align-items: center;
                            font-size:larger;
                        }

                        #successMsg{
                            text-align:center;
                            margin-bottom:20px;
                        }
                    `
                }
            </style>
        </>
     );
}

export default Success;