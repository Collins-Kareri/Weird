import React from "react";
import { Routes, Route } from "react-router-dom";
import Notification from "@components/notification";
import Home from "@pages/home";
import CreateAccount from "@pages/createAccount/createAccount";
import Login from "@pages/login";
import Publish from "@pages/publishPhoto";
import { NotificationProvider, NotficationConsumer } from "@context/notifications.context";
import RequireAuth from "./requireAuth";
import HiddenWhileAuthenticated from "./hiddenWhileAuthenticated";

function App() {
    return (
        <NotificationProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<HiddenWhileAuthenticated />}>
                    <Route path="createAccount" element={<CreateAccount />} />
                    <Route path="login" element={<Login />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route path="publish" element={<Publish />} />
                </Route>
            </Routes>

            <NotficationConsumer>
                <Notification />
            </NotficationConsumer>
        </NotificationProvider>
    );
}

export default App;
