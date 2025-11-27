import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
  Tooltip
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "../../../Utils/BaseUrl.js";
import { toast } from "react-hot-toast";
 
const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Approved",
    value: "APPROVED",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
  {
    label: "Ongoing",
    value: "ONGOING",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
];
const TABLE_HEAD = ["No", "Vendor", "Company Name", "Status", "Date","Action", "Details", "Delete"];

// const TABLE_ROWS = [
//       {
//             img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
//             name: "John Michael",
//             email: "john@huawei.com",
//             companyName: "Huawei",
//             LicenseNumber: "CN-4568798",
//     status: "approved",
//     date: "23/04/18",
//     action: true,
//   },
//   {
//         img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
//         name: "Alexa Liras",
//         email: "alexa@huawei.com",
//     companyName: "Huawei",
//     LicenseNumber: "CN-4568798",
//     status: "ongoing",
//     date: "23/04/18",
//     action: true,
//   },
//   {
//         img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
//         name: "Laurent Perrier",
//         email: "laurent@huawei.com",
//         companyName: "Huawei",
//     LicenseNumber: "CN-4568798",
//     status: "pending",
//     date: "19/09/17",
//     action: false,
//   },
//   {
//         img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
//         name: "Michael Levi",
//         email: "michael@huawei.com",
//         companyName: "Huawei",
//         LicenseNumber: "CN-4568798",
//         status: "approved",
//         date: "24/12/08",
//         action: true,
//       },
//       {
//             img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
//             name: "Richard Gran",
//     email: "richard@huawei.com",
//     companyName: "Huawei",
//     LicenseNumber: "CN-4568798",
//     status: "rejected",
//     date: "04/10/21",
//     action: false,
//   },
// ];

export function VendorTable() {
    const navigate = useNavigate()
    const [TABLE_ROWS, SETTABLE_ROWS] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
          const authToken = localStorage.getItem("authToken");
    
          if (!authToken) {
            toast.error("Unauthorized: No token found! Please log in.");
            navigate("/admin/admin-login");
            return;
          }
    
          try {
            console.log("Fetching seller applications...");
            // const response = await axios.get("api/admin/applications", {
             const response = await axios.get(`/api/admin/vendors?page=${page}&limit=${limit}`, {

              headers: {
                Authorization: `Bearer ${authToken}`, 
              },
            });
    
            console.log(response, "------------------>>");
    
            if (response.status === 200) {
              SETTABLE_ROWS(response.data);
            }
          } catch (error) {
            console.error("Error fetching applications:", error);
    
            if (error.response?.status === 401) {
              toast.error(
                "Unauthorized: Your session has expired. Please log in again."
              );
              localStorage.removeItem("authToken"); 
              navigate("/admin/admin-login");
            } else {
              toast.error("Failed to load applications. Please try again.");
              navigate("/admin/admin-login");
            }
          }
        };
    
        fetchApplications();
      }, []);


    return (
        <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
            <div>
                <Typography variant="h5" color="blue-gray">
                Vendors list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                See information about all vendors
                </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button variant="outlined" size="sm">
                view all
                </Button>
                <Button className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Vendor
                </Button>
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
                {TABLE_HEAD.map((head) => (
                    <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                    >
                        {head}
                    </Typography>
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {TABLE_ROWS.map(
                (data, index) => {
                    const isLast = index === TABLE_ROWS.length - 1;
                    const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
    
                    return (
                    <tr key={name}>
                        <td className="py-3 px-4 text-center">{index + 1}</td>
                        <td className={classes}>
                        <div className="flex items-center gap-3">
                            <Avatar src={data.livePhoto} alt={data.name} size="sm" />
                            <div className="flex flex-col">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                {data.name}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                            >
                                {data.email}
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
                            {data.tradeName}
                            </Typography>
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                            >
                            {data.licenseNumber}
                            </Typography>
                        </div>
                        </td>
                        
                        <td className={classes}>
                            <div className="w-max">
                                <Chip
                                variant="ghost"
                                size="sm"
                                value={data.status}
                                color={
                                    data.status === "APPROVED"
                                    ? "green"
                                    : data.status === "REJECTED"
                                    ? "red"
                                    : data.status === "ONGOING"
                                    ? "orange"
                                    : data.status === "PENDING"
                                    ? "blue"
                                    : "blue-gray"
                                }
                                />
                            </div>
                        </td>

                        <td className={classes}>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {data.createdAt}
                        </Typography>
                        </td>

                        <td className={classes}>
                        <div className="w-max">
                            <Chip
                            variant="filled"
                            size="md"
                            value={data.action ? "block" : "unblock"}
                            color={data.action ? "green" : "red"}
                            className="w-20 items-center justify-center cursor-pointer"
                            />
                        </div>
                        </td>

                        <td className={classes}>
                        <button 
                            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-900">View Details</button>

                        </td>
                        <td className={classes}>
                        <Tooltip content="Delete Vendor">
                            <IconButton variant="text">
                            <TrashIcon className="h-4 w-4 text-red-800" />
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
            <Link to='/admin/vendor-management'><h4 className="text-red-900">View All &gt; </h4></Link>
        </CardFooter>
        </Card>
    );
}