import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { TrashIcon } from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";

  import { DeleteUserModal } from "../Modal/User/DeleteUserModal";
import { useState } from "react";
   
  const TABS = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Delivered",
      value: "delivered",
    },
    {
        label: "Shipped",
        value: "shipped",
    },
    {
        label: "Cancelled",
        value: "cancelled",
    },
    {
        label: "Returned",
        value: "returned",
    },
  ];
   
  const TABLE_HEAD = ["No", "Order ID", "Billing Name", "Email", "Date", "Prize", "Status", "Payment Method", "View Details", "Cancel", "Shipped/Delivered/Returned/Cancelled"];
  const TABLE_ROWS = [
    {
        orderId: "GHJCT1523",
        billingName: "Akhila Vijayan",
        email: "john@creative-tim.com",
        date: "2025-01-14",
        status: "shipped",
        paymentMethod: "COD",
        phone: "+9715865985256",
    },
    {
      img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
      name: "Alexa Liras",
      email: "alexa@creative-tim.com",
      status: false,
      phone: "+9715865985256",
    },
    {
      img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
      name: "Laurent Perrier",
      email: "laurent@creative-tim.com",
      status: false,
      phone: "+9715865985256",
    },
    {
      img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
      name: "Michael Levi",
      email: "michael@creative-tim.com",
      status: true,
      phone: "+9715865985256",
    },
    {
      img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
      name: "Richard Gran",
      email: "richard@creative-tim.com",
      status: false,
      phone: "+9715865985256",
    },
  ];
   
  export function UserTable() {
        const [isModalOpenDeleteUser, setIsModalOpenDeleteUser] = useState(false);

        const handleDeleteUser = () => {
            console.log("User deleted");
            setIsModalOpenDeleteUser(false); 
        };
    
    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Order Management
                        </Typography>
                        {/* <Typography color="gray" className="mt-1 font-normal">
                            See information about all customers
                        </Typography> */}
                    </div>
                </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value="all" className="w-full md:w-max">
                    <TabsHeader>
                        {TABS.map(({ label, value }) => (
                        <Tab key={value} value={value}>
                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                        </Tab>
                        ))}
                    </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                    <Input
                        label="Search"
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                </div>
            </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head, index) => (
                        <th
                            key={head}
                            className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                                {head}{" "}
                                {index !== TABLE_HEAD.length - 1 && (
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                )}
                            </Typography>
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                        {TABLE_ROWS.map(
                            ({ img, name, email, status, phone }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";
            
                            return (
                                <tr key={name}>
                                <td className="py-3 px-4 text-center">{index + 1}</td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <Avatar src={img} alt={name} size="sm" />
                                        <div className="flex flex-col">
                                            <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                            >
                                            {name}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex flex-col">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {email}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="w-max">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={status ? "unblocked" : "blocked"}
                                            color={status ? "green" : "blue-gray"}
                                        />
                                    </div>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {phone}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Tooltip content="Delete User">
                                    <IconButton 
                                        onClick={() => setIsModalOpenDeleteUser(true) }
                                        variant="text"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </IconButton>
                                    </Tooltip>
                                </td>
                                </tr>
                            );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page 1 of 10
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                </div>
            </CardFooter>

            <DeleteUserModal
                open={isModalOpenDeleteUser}
                setOpen={setIsModalOpenDeleteUser}
                deleteUser={handleDeleteUser}
            />
      </Card>
    );
  }