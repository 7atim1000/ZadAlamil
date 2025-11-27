import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
  } from "@material-tailwind/react";
  import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
   
  export function MenuDefault() {
    return (
      <Menu>
        <MenuHandler>
          <Button className="flex bg-gradient-to-r from-[#1D0F0F] to-[#972323]">Last 6 Months<ArrowDownTrayIcon className="w-5 h-4 ml-2"/></Button>
        </MenuHandler>
        <MenuList>
          <MenuItem>Last 1 Year</MenuItem>
          <MenuItem>Last 2 Year</MenuItem>
          <MenuItem>Last 3 Year</MenuItem>
        </MenuList>
      </Menu>
    );
  }