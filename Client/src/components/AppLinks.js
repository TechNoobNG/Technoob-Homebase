import { NavLink } from "react-router-dom";

function AppLinks() {
  return (
    <nav>
      <ul className="hidden lg:flex text-lg font-normal justify-between gap-8">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="resources">Resources</NavLink>
        </li>
        <li>
          <NavLink to="about">About Us</NavLink>
        </li>
        <li>
          <NavLink to="contact">Contact Us</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppLinks;
