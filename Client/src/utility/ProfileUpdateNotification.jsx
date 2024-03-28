import { Fragment } from "react";
import { createPortal } from "react-dom";
import classes from "./NotificationModal.module.css";

const Backdrop = (props) => {
  return <div className={classes.overlay} onClick={props.onClick} />;
};

const renderObject = (obj, keyMap) => {
  return (
    <ul>
      {Object.entries(obj).map(([key, value]) => (
        <li key={key}>
          <strong>{key[keyMap]}: </strong>
          {typeof value === "object" ? renderObject(value, keyMap) : value}
        </li>
      ))}
    </ul>
  );
};

const NotificationModal = (props) => {
  const { title, message, updateInfo = {}, onCancel, onConfirm } = props;

  const keyMap = {
    bio: "Bio",
    country: "Country",
    stack: "Stack",
    firstname: "First Name",
    lastname: "Last Name",
    email: "Email",
    phone: "Phone",
    website: "Website",
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    employmentHistory: "Employment History",
    role: "Role",
    company: "Company",
    jobType: "Job Type",
    // country: "Country",
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <table>
          <tbody>
            {Object.entries(value).map(([nestedKey, nestedValue]) => (
              <tr key={nestedKey}>
                <td>
                  <strong>{keyMap[nestedKey]}: </strong>
                </td>
                <td>{renderValue(nestedValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return value;
    }
  };

  return (
    <div className={classes.modal}>
      <header className={classes.header}>
        <h2>{title}</h2>
      </header>
      <div className={classes.content}>
        <p>{message}</p>
        {updateInfo && (
          <table>
            <tbody>
              {Object.entries(updateInfo).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <strong>{keyMap[key]} :</strong>
                  </td>
                  <td>{renderValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <footer className={classes.actions}>
        <button className={classes.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button className={classes.confirmButton} onClick={onConfirm}>
          Confirm
        </button>
      </footer>
    </div>
  );
};

const ProfileUpdateNotification = (props) => {
  const { title, message, updateInfo = {}, setDisplayConfirmation, sendUpdateRequest } = props;
  const onCancelHandler = () => {
    setDisplayConfirmation(false);
  };

  const onConfirmHandler = () => {
    setDisplayConfirmation(false);
    sendUpdateRequest(updateInfo);
  };

  return (
    <Fragment>
      {createPortal(<Backdrop onClick={onCancelHandler} />, document.getElementById("backdrop-root"))}
      {createPortal(
        <NotificationModal
          title={title || "Update Profile"}
          message={message}
          updateInfo={updateInfo}
          onCancel={onCancelHandler}
          onConfirm={onConfirmHandler}
        />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};

export default ProfileUpdateNotification;
