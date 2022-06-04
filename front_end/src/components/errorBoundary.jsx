import {Component} from "react";

class ErrorBoundary extends Component {
    constructor(props){
        super(props);
        this.state={hasError:false}
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
       console.log(error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
            <div style={{display:"flex",width:"100%", height:"fit-content",flexDirection: "row",flexWrap: "wrap",justifyContent: "center"}}>
                <h1 style={{display:"inline-block",position:"fixed",width:"50vw",top:"50%",transform:"translateY(-50%)",padding:"15px",fontFamily:"Quicksand,sans-serif", textAlign:"center"}}>Couldn't display this page. Something went wrong please reload the page.  </h1>  
            </div>
        )
      }

      return this.props.children; 
    }
}
 
export default ErrorBoundary;