import React from "react";
import CreateAccount from "@pages/createAccount/createAccount";
import Notification from "@components/notification";
import "@client/app.css";

function App() {
    return (
        <>
            <Notification
                notifications={[
                    { notificationType: "info", msg: "info notification" },
                    { notificationType: "error", msg: "error notification" },
                ]}
            />
            <CreateAccount />;
        </>
    );
}

export default App;
