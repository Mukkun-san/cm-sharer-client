const API_URL = "http://localhost:4545/api/v1"; // http://localhost:4545  // https://cmshare.herokuapp.com

const ADMIN_TOKEN = () => {
  return window.localStorage.getItem("adminToken");
};

const DRIVE_FOLDER_NAME = "CM Sharer";

const CLIENT_ID =
  "600641611458-n9vn0ido82l4pf9i8eomg6atis1batq5.apps.googleusercontent.com";

const API_KEY = "AIzaSyDURzWoWCnSa5Mj5ED0o_4tCrIQGsaybow";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/drive";

export {
  API_URL,
  CLIENT_ID,
  API_KEY,
  DISCOVERY_DOCS,
  SCOPES,
  DRIVE_FOLDER_NAME,
  ADMIN_TOKEN,
};
