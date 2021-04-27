import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, ADMIN_TOKEN } from "../../store/consts";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { Helmet } from "react-helmet";

export default function AddLinks() {
  function GoogleDrive() {
    const [validation, setValidation] = useState({});
    const [link, setLink] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [bulkLoading, setBulkLoading] = useState(false);
    const [generatedLinks, setGeneratedLinks] = useState([]);

    const [inBulk, setInBulk] = useState(false);
    const [byID, setByID] = useState(false);
    const [bulkLinks, setBulkLinks] = useState("");

    async function generateOne(e) {
      e.preventDefault();
      setLoading(true);
      const linkRegExp = new RegExp("^https://drive.google.com/file/d/", "i");
      if (!byID && !link.match(linkRegExp)) {
        setMessage("'" + link + "' is not a valid drive file link!");
      } else {
        let fileId;
        if (byID) {
          fileId = link.trim();
        } else {
          let part1 = link.replace(linkRegExp, "");
          fileId = part1.substring(0, part1.indexOf("/"));
        }
        setMessage("Checking Drive File...");
        window.gapi.client.drive.files
          .get({
            fileId,
            fields: "id, name, size, mimeType,description, videoMediaMetadata",
          })
          .then(async (getfile) => {
            setMessage("Generating File Link");
            let addfile = await axios.post(
              API_URL + "/links/add/drive",
              getfile.result,
              { headers: { authorization: ADMIN_TOKEN() } }
            );
            if (addfile.data.slug) {
              setMessage(
                <p>
                  {addfile.data.msg}
                  <br /> <b>Link:</b>
                  <a href={window.location.origin + "/d/" + addfile.data.slug}>
                    {window.location.origin + "/d/" + addfile.data.slug}
                  </a>
                </p>
              );
            } else if (addfile.data.msg) {
              setMessage("Internal server error");
            }
          })
          .catch((error) => {
            setMessage(error.result.error.message);
          });
      }
      setLoading(false);
    }

    function generateBulk() {
      setGeneratedLinks(true);
      setBulkLoading(true);
      let allLinks = [];
      let loading = [];
      bulkLinks.split("\n").forEach(async (line, idx) => {
        loading.push(true);
        allLinks.push({});
        const linkRegExp = new RegExp("^https://drive.google.com/file/d/", "i");
        if (!byID && !line.match(linkRegExp)) {
          loading[idx] = false;
          allLinks[idx] = {
            msg: "'" + line + "' is not a valid drive file link!",
          };
        } else {
          let fileId = line.trim();
          if (!byID) {
            let part1 = line.replace(linkRegExp, "");
            fileId = part1.substring(0, part1.indexOf("/"));
          }
          window.gapi.client.drive.files
            .get({
              fileId,
              fields:
                "id, name, size, mimeType,description, videoMediaMetadata",
            })
            .then(async (getfile) => {
              let addfile = await axios.post(
                API_URL + "/links/add/drive",
                getfile.result,
                { headers: { authorization: ADMIN_TOKEN() } }
              );
              if (addfile.data) {
                allLinks[idx] = {
                  msg: addfile.data.msg,
                  link: addfile.data.slug
                    ? window.location.origin + "/d/" + addfile.data.slug
                    : null,
                };
              } else {
                allLinks[idx] = {
                  msg: "Problem generating link",
                };
              }
              loading[idx] = false;
              if (loading.every((L) => !L)) {
                setGeneratedLinks(allLinks);
                setBulkLoading(false);
              }
            })
            .catch((error) => {
              loading[idx] = false;
              allLinks[idx] = {
                msg: error.result.error.msg,
              };
              if (loading.every((L) => !L)) {
                setGeneratedLinks(allLinks);
                setBulkLoading(false);
              }
            });
        }
      });
    }

    function reset() {
      setMessage("");
      setLoading(false);
    }

    return (
      <div className="container">
        <br />
        <div className="row">
          <div className="col">
            <div className="col-12 m-3">
              <img
                src={require("../../assets/Google_Drive_logo.png")}
                width="40"
                alt="drive-logo"
              />
              <h4
                style={{ position: "absolute", bottom: 0 }}
                className="text-success font-weight-normal d-inline ml-3"
              >
                Add Google Drive Links
              </h4>
              <label className="float-right d-flex align-content-center mr-3">
                <span className="mr-2">
                  <b
                    className={
                      inBulk
                        ? "text-secondary font-weight-normal"
                        : "text-success"
                    }
                  >
                    Single
                  </b>{" "}
                </span>
                <Toggle
                  icons={false}
                  checked={inBulk}
                  onChange={(e) => {
                    setInBulk(Boolean(e.target.checked));
                    reset();
                  }}
                />
                <span className="ml-2">
                  <b
                    className={
                      inBulk
                        ? "text-success"
                        : "text-secondary font-weight-normal"
                    }
                  >
                    Bulk
                  </b>{" "}
                </span>
              </label>
              <label className="float-right d-flex align-content-center mr-5">
                <span className="mr-2">
                  <b
                    className={
                      byID
                        ? "text-secondary font-weight-normal"
                        : "text-success"
                    }
                  >
                    By Link
                  </b>{" "}
                </span>
                <Toggle
                  icons={false}
                  checked={byID}
                  onChange={(e) => {
                    setByID(Boolean(e.target.checked));
                  }}
                />
                <span className="ml-2">
                  <b
                    className={
                      byID
                        ? "text-success"
                        : "text-secondary font-weight-normal"
                    }
                  >
                    By ID
                  </b>{" "}
                </span>
              </label>
            </div>
            {inBulk ? (
              <div className="mb-4">
                <p className="text-center text-secondary font-italic">
                  1 link /ID per line.
                </p>
                <div className="form-group d-flex justify-content-center">
                  <textarea
                    value={bulkLinks}
                    onChange={(e) => {
                      setBulkLinks(e.target.value);
                    }}
                    className="form-control w-75"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                <div className="row">
                  <button
                    disabled={bulkLinks ? false : true}
                    className="btn btn-success mx-auto"
                    onClick={generateBulk}
                  >
                    Generate All
                  </button>
                </div>
                <div className="row mx-auto mt-3">
                  {bulkLoading ? (
                    <div
                      className="spinner-border text-primary mx-auto"
                      role="status"
                    >
                      <span className="sr-only text-primary">Loading...</span>
                    </div>
                  ) : null}{" "}
                </div>
                <div className="bg-light my-3 mx-5">
                  {generatedLinks && generatedLinks.length
                    ? generatedLinks.map((L, i) => {
                        return (
                          <div key={"yadisk-link" + i}>
                            <b>{i + 1}- </b>
                            {L.msg}
                            {L.link ? <a href={L.link}>: OPEN LINK</a> : null}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            ) : (
              <div className="form-group my-4">
                <form onSubmit={generateOne}>
                  <div className="row ml-3">
                    <div className="col-9">
                      <input
                        placeholder="Paste Drive Link or ID"
                        type="text"
                        className={`form-control ${validation.state}`}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>
                    <div className="col-3">
                      <button
                        type="submit"
                        className={
                          loading ? "btn btn-light" : "btn btn-warning"
                        }
                        disabled={loading || !link ? true : false}
                      >
                        {!loading ? (
                          "Generate"
                        ) : (
                          <div
                            className="spinner-border text-warning"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </button>
                    </div>
                    <p className={"col-12 mt-3 " + validation.class}>
                      {validation.text}
                    </p>
                  </div>
                </form>
                <div className="p-3 bg-light text-center font-smaller">
                  {message ? <div>{message}</div> : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function YandexDisk() {
    const [link, setLink] = useState("");

    const [bulkLoading, setBulkLoading] = useState(false);
    const [generatedLinks, setGeneratedLinks] = useState([]);

    const [validation, setValidation] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [inBulk, setInBulk] = useState(false);
    const [bulkLinks, setBulkLinks] = useState("");

    function generateOne(e) {
      e.preventDefault();
      setMessage("Loading...");
      axios
        .post(
          API_URL + "/links/add/yandex",
          { public_key: link.trim() },
          { headers: { authorization: ADMIN_TOKEN() } }
        )
        .then((result) => {
          console.log(result);
          if (result.data.slug) {
            setMessage(
              <p>
                File available at:
                <a href={window.location.origin + "/y/" + result.data.slug}>
                  {window.location.origin + "/y/" + result.data.slug}
                </a>
              </p>
            );
          } else {
            setMessage(result.data.msg);
          }
        })
        .catch((err) => {
          setMessage("Internal Server Error");
        });
    }

    function generateBulk() {
      setGeneratedLinks([]);
      let bulkLoading = [];
      let allLinks = [];
      setBulkLoading(true);
      bulkLinks.split("\n").forEach((link, linkNb) => {
        bulkLoading.push(true);
        allLinks.push({});
        axios
          .post(
            API_URL + "/links/add/yandex",
            { public_key: link.trim() },
            { headers: { authorization: ADMIN_TOKEN() } }
          )
          .then((result) => {
            if (result.data) {
              allLinks[linkNb] = {
                msg: result.data.msg,
                link: result.data.slug
                  ? window.location.origin + "/y/" + result.data.slug
                  : null,
              };
            }
            bulkLoading[linkNb] = false;
            if (bulkLoading.every((x) => !x)) {
              setBulkLoading(false);
              setGeneratedLinks(allLinks);
              window.bulklinks = allLinks;
              console.log("finished:", generatedLinks);
            }
          })
          .catch((err) => {
            setMessage("Error adding link.");
          });
      });
    }

    function reset() {
      setMessage("");
      setLoading(false);
    }

    return (
      <div className="container">
        <Helmet>
          <title>Dashboard - Generate Links</title>
        </Helmet>
        <br />
        <div className="row">
          <div className="col">
            <div className="col-12 m-3">
              <img
                src={require("../../assets/yandex-disk-logo.png")}
                width="40"
                alt="drive-logo"
              />
              <h4
                style={{ position: "absolute", bottom: 0 }}
                className="text-primary font-weight-normal d-inline ml-3"
              >
                Add Yandex.Disk Links
              </h4>
              <label className="float-right d-flex align-content-center">
                <span className="mr-2">
                  <b
                    className={
                      inBulk
                        ? "text-secondary font-weight-normal"
                        : "text-success"
                    }
                  >
                    Single
                  </b>{" "}
                </span>
                <Toggle
                  icons={false}
                  checked={inBulk}
                  onChange={(e) => {
                    setInBulk(Boolean(e.target.checked));
                    reset();
                  }}
                />
                <span className="ml-2">
                  <b
                    className={
                      inBulk
                        ? "text-success"
                        : "text-secondary font-weight-normal"
                    }
                  >
                    Bulk
                  </b>{" "}
                </span>
              </label>
            </div>

            {inBulk ? (
              <div className="mb-4">
                <p className="text-center text-secondary font-italic">
                  1 link per line.
                </p>
                <div className="form-group d-flex justify-content-center">
                  <textarea
                    value={bulkLinks}
                    onChange={(e) => {
                      setBulkLinks(e.target.value);
                    }}
                    className="form-control w-75"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                <div className="row">
                  <button
                    disabled={bulkLinks ? false : true}
                    className="btn btn-success mx-auto"
                    onClick={generateBulk}
                  >
                    Generate All
                  </button>
                </div>
                {bulkLoading ? (
                  <div className="row mx-auto mt-3">
                    <div
                      className="spinner-border text-primary mx-auto"
                      role="status"
                    >
                      <span className="sr-only text-primary">Loading...</span>
                    </div>
                  </div>
                ) : null}
                <div className="bg-light my-3 mx-5">
                  {generatedLinks && generatedLinks.length
                    ? generatedLinks.map((L, i) => {
                        return (
                          <div key={"yadisk-link" + i}>
                            <b>{i + 1}- </b>
                            {L.msg}
                            {L.link ? <a href={L.link}>: OPEN LINK</a> : null}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            ) : (
              <div className="form-group my-4">
                <form onSubmit={generateOne}>
                  <div className="row ml-3">
                    <div className="col-9">
                      <input
                        placeholder="Paste Yandex.Disk public link"
                        type="text"
                        className={`form-control ${validation.state}`}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>
                    <div className="col-3">
                      <button
                        type="submit"
                        className={
                          loading ? "btn btn-light" : "btn btn-warning"
                        }
                        disabled={loading || !link ? true : false}
                      >
                        {!loading ? (
                          "Generate"
                        ) : (
                          <div
                            className="spinner-border text-warning"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </button>
                    </div>
                    <p className={"col-12 mt-3 " + validation.class}>
                      {validation.text}
                    </p>
                  </div>
                </form>
                <div className="p-3 bg-light text-center font-smaller">
                  {message ? <div>{message}</div> : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function OpenDrive() {
    const [link, setLink] = useState("");

    const [bulkLoading, setBulkLoading] = useState(false);
    const [generatedLinks, setGeneratedLinks] = useState([]);

    const [validation, setValidation] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [inBulk, setInBulk] = useState(false);
    const [bulkLinks, setBulkLinks] = useState("");

    function generateOne(e) {
      e.preventDefault();
      if (
        link &&
        link.length &&
        link.trim().match(new RegExp("^https://www.opendrive.com/file/", "i"))
      ) {
        setMessage("Loading...");
        axios
          .post(
            API_URL + "/links/add/opendrive",
            {
              fileId: link
                .trim()
                .replace("https://www.opendrive.com/file/", ""),
            },
            { headers: { authorization: ADMIN_TOKEN() } }
          )
          .then((result) => {
            console.log(result);
            if (result.data.slug) {
              setMessage(
                <p>
                  File available at:
                  <a href={window.location.origin + "/o/" + result.data.slug}>
                    {window.location.origin + "/o/" + result.data.slug}
                  </a>
                </p>
              );
            } else {
              setMessage(result.data.msg);
            }
          })
          .catch((err) => {
            setMessage("Internal Server Error");
          });
      } else {
        alert("link error");
      }
    }
    function generateBulk() {
      setGeneratedLinks([]);
      let bulkLoading = [];
      let allLinks = [];
      setBulkLoading(true);
      bulkLinks.split("\n").forEach((link, linkNb) => {
        bulkLoading.push(true);
        allLinks.push({});
        if (
          link &&
          link.length &&
          link.trim().match(new RegExp("^https://www.opendrive.com/file/", "i"))
        ) {
          axios
            .post(
              API_URL + "/links/add/opendrive",
              {
                fileId: link
                  .trim()
                  .replace(
                    new RegExp("^https://www.opendrive.com/file/", "i"),
                    ""
                  ),
              },
              { headers: { authorization: ADMIN_TOKEN() } }
            )
            .then((result) => {
              if (result.data) {
                allLinks[linkNb] = {
                  msg: result.data.msg,
                  link: result.data.slug
                    ? window.location.origin + "/o/" + result.data.slug
                    : null,
                };
              }
              bulkLoading[linkNb] = false;
              if (bulkLoading.every((x) => !x)) {
                setBulkLoading(false);
                setGeneratedLinks(allLinks);
                window.bulklinks = allLinks;
                console.log("finished:", generatedLinks);
              }
            })
            .catch((err) => {
              setMessage("Error adding link.");
            });
        } else {
          allLinks[linkNb] = {
            msg: "link invalid",
          };
        }
      });
    }

    function reset() {
      setMessage("");
      setLoading(false);
    }

    return (
      <div className="container">
        <Helmet>
          <title>Dashboard - Generate Links</title>
        </Helmet>
        <br />
        <div className="row">
          <div className="col">
            <div className="col-12 m-3">
              <img
                src="https://image.flaticon.com/icons/png/512/873/873138.png"
                width="40"
                alt="drive-logo"
              />
              <h4
                style={{ position: "absolute", bottom: 0 }}
                className="text-primary font-weight-normal d-inline ml-3"
              >
                Add OpenDrive Links
              </h4>
              <label className="float-right d-flex align-content-center">
                <span className="mr-2">
                  <b
                    className={
                      inBulk
                        ? "text-secondary font-weight-normal"
                        : "text-success"
                    }
                  >
                    Single
                  </b>{" "}
                </span>
                <Toggle
                  icons={false}
                  checked={inBulk}
                  onChange={(e) => {
                    setInBulk(Boolean(e.target.checked));
                    reset();
                  }}
                />
                <span className="ml-2">
                  <b
                    className={
                      inBulk
                        ? "text-success"
                        : "text-secondary font-weight-normal"
                    }
                  >
                    Bulk
                  </b>{" "}
                </span>
              </label>
            </div>

            {inBulk ? (
              <div className="mb-4">
                <p className="text-center text-secondary font-italic">
                  1 link per line.
                </p>
                <div className="form-group d-flex justify-content-center">
                  <textarea
                    value={bulkLinks}
                    onChange={(e) => {
                      setBulkLinks(e.target.value);
                    }}
                    className="form-control w-75"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                <div className="row">
                  <button
                    disabled={bulkLinks ? false : true}
                    className="btn btn-success mx-auto"
                    onClick={generateBulk}
                  >
                    Generate All
                  </button>
                </div>
                {bulkLoading ? (
                  <div className="row mx-auto mt-3">
                    <div
                      className="spinner-border text-primary mx-auto"
                      role="status"
                    >
                      <span className="sr-only text-primary">Loading...</span>
                    </div>
                  </div>
                ) : null}
                <div className="bg-light my-3 mx-5">
                  {generatedLinks && generatedLinks.length
                    ? generatedLinks.map((L, i) => {
                        return (
                          <div key={"yadisk-link" + i}>
                            <b>{i + 1}- </b>
                            {L.msg}
                            {L.link ? <a href={L.link}>: OPEN LINK</a> : null}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            ) : (
              <div className="form-group my-4">
                <form onSubmit={generateOne}>
                  <div className="row ml-3">
                    <div className="col-9">
                      <input
                        placeholder="Paste OpenDrive public link"
                        type="text"
                        className={`form-control ${validation.state}`}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>
                    <div className="col-3">
                      <button
                        type="submit"
                        className={
                          loading ? "btn btn-light" : "btn btn-warning"
                        }
                        disabled={loading || !link ? true : false}
                      >
                        {!loading ? (
                          "Generate"
                        ) : (
                          <div
                            className="spinner-border text-warning"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        )}
                      </button>
                    </div>
                    <p className={"col-12 mt-3 " + validation.class}>
                      {validation.text}
                    </p>
                  </div>
                </form>
                <div className="p-3 bg-light text-center font-smaller">
                  {message ? <div>{message}</div> : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card w-75 bg-light mx-auto my-4">
        <div className="card-header">
          <h1 className="text-center">Generate Links</h1>
        </div>
        <div className="card-body">
          <div className="card col h-50">
            <GoogleDrive />
          </div>
          <br />
          <br />
          <div className="card col">
            <YandexDisk />
          </div>
          <br />
          <br />
          <div className="card col">
            <OpenDrive />
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}
