import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import GDriveFileDownload from "./pages/Main/GDriveFileDownload";
import YandexFileDownload from "./pages/Main/YandexFileDownload";
import OpenDriveFileDownload from "./pages/Main/OpenDriveFileDownload";
import Home from "./pages/Main/Home";
import Account from "./pages/Main/Account";
import Contact from "./pages/Main/Contact";
import DMCA from "./pages/Main/DMCA";
import Terms from "./pages/Main/Terms";
import PrivacyPolicy from "./pages/Main/PrivacyPolicy";
import NotFound from "./pages/NotFound/NotFound";
import AdminDashboard from "./pages/Admin/Dashboard";
import DashboardUsers from "./pages/Admin/Users";
import DriveLinks from "./pages/Admin/DriveLinks";
import YandexLinks from "./pages/Admin/YandexLinks";
import OpendriveLinks from "./pages/Admin/OpendriveLinks";
import AdminLogin from "./pages/Admin/Login";
import AdminAccount from "./pages/Admin/Account";
import AddLinks from "./pages/Admin/AddLinks";
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import AdminNavBar from "./components/AdminNavBar";
import axios from "axios";
import { API_URL, ADMIN_TOKEN } from "./store/consts.js";
import { CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } from "./store/consts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [adminIsLoggedin, setAdminIsLoggedin] = useState(null);

  function gapiInit() {
    try {
      window.gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: DISCOVERY_DOCS,
        })
        .then(() => {
          let Oauth = window.gapi.auth2.getAuthInstance();
          Oauth.isSignedIn.listen(() => {
            setUser(Oauth.currentUser.get());
            window.location.reload();
          });
          setUser(Oauth.currentUser.get());
        });
    } catch (e) {}
  }

  function handleAuthClick() {
    window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(async (user) => {
        let userdata = {
          uid: user.getBasicProfile().getId(),
          username: user.getBasicProfile().getName(),
          email: user.getBasicProfile().getEmail(),
          picture: user.getBasicProfile().getImageUrl(),
        };
        await axios.post(API_URL + "/users/addOne", userdata, {
          headers: { authorization: ADMIN_TOKEN },
        });
        window.location.reload();
      })
      .catch((err) => {
        window.location.reload();
      });
  }

  function handleClientLoad() {
    window.gapi.load("client:auth2", gapiInit);
  }

  useEffect(() => {
    var script = document.createElement("script");
    script.onload = handleClientLoad;
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);

    adminAuth();
  });

  async function adminAuth() {
    let res = await axios.post(
      API_URL + "/admin/authorize",
      {},
      { headers: { authorization: ADMIN_TOKEN } }
    );
    if (res.data && res.data.authorized) {
      setAdminIsLoggedin(true);
    } else {
      setAdminIsLoggedin(false);
    }
  }

  return (
    <Router>
      <ToastContainer />
      {!(window.gapi && user) || adminIsLoggedin === null ? (
        <div className="col d-flex justify-content-center">
          <Loader color="warning" />
        </div>
      ) : (
        <div
          style={{
            backgroundImage: 'url("./assets/1526027.jpg")',
          }}
        >
          <Switch>
            <Route exact path="/admin/dashboard/users">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <DashboardUsers />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route exact path="/admin/dashboard/links/drive">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <DriveLinks />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route exact path="/admin/dashboard/links/yandex">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <YandexLinks />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route exact path="/admin/dashboard/links/opendrive">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <OpendriveLinks />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route exact path="/admin/add-links">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <AddLinks />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route path="/admin/dashboard">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <AdminDashboard />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route exact path="/admin/account">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {adminIsLoggedin ? (
                <AdminAccount />
              ) : (
                <Redirect to={{ pathname: "/admin/login" }} />
              )}
            </Route>
            <Route exact path="/admin/login">
              <AdminNavBar adminIsLoggedin={adminIsLoggedin} />
              {!adminIsLoggedin ? (
                <AdminLogin />
              ) : (
                <Redirect to={{ pathname: "/admin/dashboard" }} />
              )}
            </Route>
            <Route path="/admin/">
              <Redirect to={{ pathname: "/admin/login" }} />
            </Route>

            <Route exact path="/d/:slug">
              <NavBar currentUser={user} />
              <GDriveFileDownload
                user={user}
                handleAuthClick={handleAuthClick}
              />
            </Route>
            <Route
              exact
              path="/y/:slug"
              onEnter={() => console.log("Entered /")}
            >
              <NavBar currentUser={user} />
              <YandexFileDownload />
            </Route>
            <Route exact path="/o/:slug">
              <NavBar /> <OpenDriveFileDownload />
            </Route>
            <Route exact path="/page/privacy-policy">
              <NavBar currentUser={user} />
              <PrivacyPolicy />
            </Route>
            <Route exact path="/page/dmca">
              <NavBar currentUser={user} />
              <DMCA />
            </Route>
            <Route exact path="/page/terms-conditions">
              <NavBar currentUser={user} />
              <Terms />
            </Route>
            <Route exact path="/page/contact">
              <NavBar currentUser={user} />
              <Contact />
            </Route>
            <Route exact path="/page/account">
              <NavBar currentUser={user} />
              {user && user.getBasicProfile() ? (
                <Account user={user} />
              ) : (
                <Redirect to={{ pathname: "/" }} />
              )}
            </Route>
            <Route exact path="/">
              <NavBar currentUser={user} />
              {user && user.getBasicProfile() ? (
                <Redirect to={{ pathname: "/page/account" }} />
              ) : (
                <Home handleAuthClick={handleAuthClick} />
              )}
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      )}
    </Router>
  );
}
