import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
  } from "@material-tailwind/react";
   
  export function MenuStatus() {
    return (
      <Menu>
        <MenuHandler>
          <Button>Pending</Button>
        </MenuHandler>
        <MenuList >
          <MenuItem>Approved</MenuItem>
          <MenuItem>Ongoing</MenuItem>
          <MenuItem>Rejected</MenuItem>
        </MenuList>
      </Menu>
    );
  }