import { useContext } from "react";
import Avatar from "./Avatar";
import { UserContext } from "../context/userContext";

function AvatarProfile() {
  const { name } = useContext(UserContext);
  return (
    <figure className="mb-9">
      <Avatar />
      <figcaption>
        <p>Hello {name},</p>
        <p>
          Today is Monday, <time>15th May, 2023</time>
        </p>
      </figcaption>
    </figure>
  );
}

export default AvatarProfile;
