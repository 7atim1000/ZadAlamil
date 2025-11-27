import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import logo from '../../../assets/images/logo.png';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { TruckIcon } from '@heroicons/react/24/outline';
import { TagIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
 
export function SidebarWithBurgerMenuVendor() {
    const [open, setOpen] = React.useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    
    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };
    
    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    
    return (
        <>
        <IconButton variant="text" size="lg" onClick={openDrawer} className="fixed left-4 z-50" >
            {isDrawerOpen ? (
            <XMarkIcon className="h-8 w-8 stroke-2" />
            ) : (
            <Bars3Icon className="h-8 w-8 stroke-2" />
            )}
        </IconButton>
        <Drawer open={isDrawerOpen} onClose={closeDrawer}>
            <Card
            color="transparent"
            shadow={false}
            className="h-[calc(100vh-2rem)] w-full p-4"
            >
            <div className="mb-2 flex items-center gap-4 p-4 mt-16">
                <img
                src={logo}
                alt="brand"
                className="h-6"
                />
                <Typography variant="h5" color="blue-gray">
                Z<strong className="text-red-900">a</strong>d Al<strong className="text-red-900">a</strong>mil
                </Typography>
            </div>
            <List>
                <Accordion>
                <Link to='/vendor/vendor-dashboard'>
                    <ListItem className="p-0" selected={open === 1}>
                    <AccordionHeader
                        onClick={() => handleOpen(1)}
                        className="border-b-0 p-3"
                    >
                        <ListItemPrefix>
                        <HomeIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="mr-auto font-normal">
                        Dashboard
                        </Typography>
                    </AccordionHeader>
                    </ListItem>
                </Link>

                <Link to='/vendor/vendor-productManagement'>
                    <ListItem className="p-0" selected={open === 1}>
                    <AccordionHeader
                        onClick={() => handleOpen(1)}
                        className="border-b-0 p-3"
                    >
                        <ListItemPrefix>
                        <Square3Stack3DIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="mr-auto font-normal">
                        Product Management
                        </Typography>
                    </AccordionHeader>
                    </ListItem>
                </Link>

                <Link to='/vendor/vendor-categoryManagement'>
                    <ListItem className="p-0" selected={open === 1}>
                    <AccordionHeader
                        onClick={() => handleOpen(1)}
                        className="border-b-0 p-3"
                    >
                        <ListItemPrefix>
                        <TagIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="mr-auto font-normal">
                        Category Management
                        </Typography>
                    </AccordionHeader>
                    </ListItem>
                </Link>

                <Link to="/vendor/vendor-orderManagement">
                    <ListItem className="p-0" selected={open === 1}>
                        <AccordionHeader
                        onClick={() => handleOpen(1)}
                        className="border-b-0 p-3"
                        >
                        <ListItemPrefix>
                            <TruckIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="mr-auto font-normal">
                        Order Management
                        </Typography>
                        </AccordionHeader>
                    </ListItem>
                </Link>

                </Accordion>
                
                <hr className="my-2 border-blue-gray-50 mb-96" />
                <ListItem>
                <ListItemPrefix>
                    <UserCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Profile
                </ListItem>
                <ListItem>
                <ListItemPrefix>
                    <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Log Out
                </ListItem>
            </List>
            
            </Card>
        </Drawer>
        </>
    );
}