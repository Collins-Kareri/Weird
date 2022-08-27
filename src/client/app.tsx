import React from "react";
import { Routes, Route } from "react-router-dom";
import Notification from "@components/notification";
import Home from "@pages/home";
import CreateAccount from "@pages/createAccount/createAccount";
import Login from "@pages/login";
import Publish from "@pages/publishPhoto";
import Profile from "@pages/profile/profile";
import EditProfile from "@pages/profile/edit";
import { NotificationProvider, NotificationConsumer } from "@context/notifications.context";
import { UserProvider, UserConsumer } from "./context/user.context";
import RequireAuth from "./requireAuth";
import HiddenWhileAuthenticated from "./hiddenWhileAuthenticated";

function App() {
    return (
        <NotificationProvider>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route element={<HiddenWhileAuthenticated />}>
                        <Route path="createAccount" element={<CreateAccount />} />
                        <Route path="login" element={<Login />} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route path="publish" element={<Publish />} />
                        <Route
                            path="profile"
                            element={
                                <UserConsumer>
                                    <Profile />
                                </UserConsumer>
                            }
                        >
                            <Route path="edit" element={<EditProfile />} />
                        </Route>
                    </Route>
                </Routes>
            </UserProvider>

            <NotificationConsumer>
                <Notification />
            </NotificationConsumer>
        </NotificationProvider>
    );
}

export default App;
