import Download from "components/commonElements/download_Collect_Like/download";
import Collect from "components/commonElements/download_Collect_Like/collect";
import Like from "components/commonElements/download_Collect_Like/like";

function Download_Collect_Like() {
    return ( 
        <div data-within="img_Actions">
            <Like/>
            <Collect/>
            <Download/>

            <style>
                {
                    `
                        div[data-within="img_Actions"]>span{
                            display:inline-block;
                            position:relative;
                            width:40px;
                            height:40px;
                            padding:15px;
                            margin:0 5px;
                            background-size:20px;
                            background-repeat: no-repeat;
                            background-position: center;
                            border-radius:8px;
                            cursor:pointer;
                        }
                    `
                }
            </style>
        </div>
     );
}

export default Download_Collect_Like;