import {Navigate} from "react-router-dom";

function LoggedInCheck(Component) {

    const LoggedInRoutes= () => {
        
        const loggedIn=window.localStorage.getItem("loggedIn");
        
        if (loggedIn === "yes") {
          return <Component />;
        } else {
          return <Navigate to="/" replace={true}/>;
        }
      };

    return LoggedInRoutes;
};

export default LoggedInCheck;