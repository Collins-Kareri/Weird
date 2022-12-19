import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import Notification from "@components/notification";
import Home from "@pages/home";
import CreateAccount from "@pages/createAccount/createAccount";
import Login from "@pages/login";
import Publish from "@pages/publishPhoto";
import Profile from "@pages/profile/profile";
import EditProfile from "@pages/profile/edit.Profile";
import EditCollection from "@pages/profile/edit.Collection";
import SearchResults from "@pages/results";
import { NotificationProvider, NotificationConsumer } from "@context/notifications.context";
import { UserProvider, UserConsumer } from "./context/user.context";
import RequireAuth from "./requireAuth";
import HiddenWhileAuthenticated from "./hiddenWhileAuthenticated";

const queryClient = new QueryClient();

function App() {
    return (
        <NotificationProvider>
            <UserProvider>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* If user is already authenticated refuse access to the selected routes */}
                        <Route element={<HiddenWhileAuthenticated />}>
                            <Route path="createAccount" element={<CreateAccount />} />
                            <Route path="login" element={<Login />} />
                        </Route>

                        {/* First check whether user is authenticated to allow access to publish images or profile routes */}
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
                                {/*Edit profile or your collection paths*/}
                                <Route path="edit" element={<EditProfile />} />
                                <Route path="edit/collection" element={<EditCollection />} />
                            </Route>
                        </Route>

                        {/* Search results route*/}
                        <Route path="search" element={<SearchResults />} />
                    </Routes>
                </QueryClientProvider>
            </UserProvider>

            {/* Notifications */}
            <NotificationConsumer>
                <Notification />
            </NotificationConsumer>
        </NotificationProvider>
    );
}

export default App;
