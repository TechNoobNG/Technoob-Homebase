import { NavLink } from "react-router-dom";

function Aside() {
  return (
    <aside className="aside">
      <nav>
        <ul className="space-y-2">
          <li className="  text-[1.6rem] border-b border-1 mb-24">
            <NavLink
              to="/user"
              className="flex items-center gap-x-10 w-full rounded-md text-white px-[2rem] py-[1rem] mb-[2.4rem] bg-[#5e7ce8]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10.5693 2.81997L3.63929 8.36997C2.85929 8.98997 2.35929 10.3 2.52929 11.28L3.85929 19.24C4.09929 20.66 5.45929 21.81 6.89929 21.81H18.0993C19.5293 21.81 20.8993 20.65 21.1393 19.24L22.4693 11.28C22.6293 10.3 22.1293 8.98997 21.3593 8.36997L14.4293 2.82997C13.3593 1.96997 11.6293 1.96997 10.5693 2.81997Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.5 15.5C13.163 15.5 13.7989 15.2366 14.2678 14.7678C14.7366 14.2989 15 13.663 15 13C15 12.337 14.7366 11.7011 14.2678 11.2322C13.7989 10.7634 13.163 10.5 12.5 10.5C11.837 10.5 11.2011 10.7634 10.7322 11.2322C10.2634 11.7011 10 12.337 10 13C10 13.663 10.2634 14.2989 10.7322 14.7678C11.2011 15.2366 11.837 15.5 12.5 15.5Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Dashboard
            </NavLink>
          </li>
          <li className="  text-[1.6rem]">
            <NavLink
              to="/resources"
              className="flex items-center gap-x-10 w-full px-[2rem] py-[1rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13.5095 2.91995L19.4095 5.53995C21.1095 6.28995 21.1095 7.52995 19.4095 8.27995L13.5095 10.8999C12.8395 11.1999 11.7395 11.1999 11.0695 10.8999L5.16953 8.27995C3.46953 7.52995 3.46953 6.28995 5.16953 5.53995L11.0695 2.91995C11.7395 2.61995 12.8395 2.61995 13.5095 2.91995Z"
                  stroke="#3A3A3A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.5 11C3.5 11.84 4.13 12.81 4.9 13.15L11.69 16.17C12.21 16.4 12.8 16.4 13.31 16.17L20.1 13.15C20.87 12.81 21.5 11.84 21.5 11"
                  stroke="#3A3A3A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.5 16C3.5 16.93 4.05 17.77 4.9 18.15L11.69 21.17C12.21 21.4 12.8 21.4 13.31 21.17L20.1 18.15C20.95 17.77 21.5 16.93 21.5 16"
                  stroke="#3A3A3A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Resources
            </NavLink>
          </li>
          <li className="  text-[1.6rem]">
            <NavLink
              to="/event"
              className="flex items-center gap-x-10 w-full px-[2rem] py-[1rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2.5 22H22.5M12.5 5C14.1 5.64 15.9 5.64 17.5 5V2C15.9 2.64 14.1 2.64 12.5 2V5ZM12.5 5V8M5.08 12H19.92M17.5 8H7.5C5.5 8 4.5 9 4.5 11V22H20.5V11C20.5 9 19.5 8 17.5 8Z"
                  stroke="#3A3A3A"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.49023 12V22M12.4902 12V22M16.4902 12V22"
                  stroke="#3A3A3A"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linejoin="round"
                />
              </svg>
              Event
            </NavLink>
          </li>
          <li className="  text-[1.6rem]">
            <NavLink
              to="/quiz"
              className="flex items-center gap-x-10 w-full px-[2rem] py-[1rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11.9693 6H16.9693M11.9693 18H15.9693M11.9693 13.95L16.9693 14M11.9693 10H14.9693M8.9393 7H3.0293M21.9693 19V5C21.9693 3 20.9693 2 18.9693 2H14.9693C12.9693 2 11.9693 3 11.9693 5V19C11.9693 21 12.9693 22 14.9693 22H18.9693C20.9693 22 21.9693 21 21.9693 19ZM5.9893 2C4.3593 2 3.0293 3.33 3.0293 4.95V17.91C3.0293 18.36 3.2193 19.04 3.4493 19.43L4.2693 20.79C5.2093 22.36 6.7593 22.36 7.6993 20.79L8.5193 19.43C8.7493 19.04 8.9393 18.36 8.9393 17.91V4.95C8.9393 3.33 7.6093 2 5.9893 2Z"
                  stroke="#3A3A3A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Quizzes and Competition
            </NavLink>
          </li>
        </ul>
      </nav>
      <ul>
        <li>profile</li>
        <li>setting</li>
        <li>logout</li>
      </ul>
    </aside>
  );
}

export default Aside;
