import React from "react";

class NoContent extends React.Component {
    render() { 
        const {displayMsg}=this.props;

        if(displayMsg){
            if(/\./.test(displayMsg)){   
                return displayMsg.split(".").map((msg)=>{
                    return <p className="noContent">{`${msg}`}</p>
                });
            }else{
                return <p className="noContent">{`${displayMsg}.`}</p>
            };
        }else{
            return <p className="noContent">No Content</p>
        }
    }
}
 
export default NoContent;