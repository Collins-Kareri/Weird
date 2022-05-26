import Button from "../button";

function Success({handleClick}) {
    return ( 
        <>
            <div className="pageStateContent" id="successMsgContainer">
                <span id="successMsg">Thank you for uploading. We will redirect to your profile where you will confirm the tags where generated for you.</span>
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