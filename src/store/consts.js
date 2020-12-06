const API_URL = "https://cmshare.herokuapp.com/api/v1"; // http://localhost:4545  // https://cmshare.herokuapp.com

const ADMIN_TOKEN = window.localStorage.getItem("adminToken");

const DRIVE_FOLDER_NAME = "CM Sharer";

const CLIENT_ID =
  "217494060995-4h0bo966ba4ei2up0tj6ujv5b1rkhf2r.apps.googleusercontent.com";
const API_KEY = "AIzaSyAQKkijRTyWPzK34TsgE2LyDlX-BxHDMNY";
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
