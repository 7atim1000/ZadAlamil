import React from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PowerIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";

import logo from '../../../assets/images/logo.png';
import login from "../../../assets/images/login.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
 
// profile menu component
const profileMenuItems = [
  {
    label: "Admin Profile",
    icon: UserCircleIcon,
  },
];
 
function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
 
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Admin Sign Out Successfully")
    navigate("/admin/admin-login");
  };
 
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src={login}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, path }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <Link key={label} to={path}>
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
            </Link>
          );
        })}

        <MenuItem
          onClick={() => {
            closeMenu();
            handleLogout();
          }}
          className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
        >
          <PowerIcon className="h-4 w-4 text-red-500" strokeWidth={2} />
          <Typography as="span" variant="small" color="red" className="font-normal">
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export function ComplexNavbar() {
  return (
    <Navbar className="max-w-none rounded-none h-16 z-50 bg-[#bcb3da] fixed">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        {/* Logo */}
        <a href="#" className="mr-4 ml-2 cursor-pointer -mt-2">
        <Link to='/admin/dashboard'><img src={logo} alt="company logo" className="h-8 w-auto"/></Link>
          <h1 className="font-semibold -ml-2 text-sm">Zad Alamil</h1>
        </a>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
 
        <div className="flex items-center gap-4">
        <Button size="sm" variant="text">
            <span>ADMIN</span>
        </Button>
        <ProfileMenu />
        </div>
      </div>
    </Navbar>
  );
}