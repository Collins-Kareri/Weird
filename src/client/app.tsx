import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Notification, { NotificationDescription } from "@components/notification";
import Home from "@pages/home";
import CreateAccount from "@pages/createAccount/createAccount";
import Login from "@pages/login";
import Publish from "@pages/publishPhoto";
import notificationContext from "@context/notifications.context";

function App() {
    const [currentNotifications, setCurrentNotifications] = useState<NotificationDescription[] | []>([]);

    return (
        <notificationContext.Provider value={{ currentNotifications, setCurrentNotifications }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="createAccount" element={<CreateAccount />} />
                <Route path="login" element={<Login />} />
                <Route path="publish" element={<Publish />} />
            </Routes>

            <notificationContext.Consumer>
                {(notifications) => notifications.currentNotifications.length > 0 && <Notification />}
            </notificationContext.Consumer>
        </notificationContext.Provider>
    );
}

export default App;
