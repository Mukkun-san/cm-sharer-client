const API_URL = "http://localhost:4545/api/v1"; // http://localhost:4545  // https://cmshare.herokuapp.com

const ADMIN_TOKEN = window.localStorage.getItem("adminToken");

const DRIVE_FOLDER_NAME = "CM Sharer";

const CLIENT_ID =
    "495651948250-5rqpcankels7bu4bvdi7e74c536a5322.apps.googleusercontent.com";
const API_KEY = "AIzaSyAcvLqHI3gPttBVttWjmbH6mU56y3aqTcA";
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