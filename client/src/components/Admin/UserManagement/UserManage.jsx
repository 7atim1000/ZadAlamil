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
    //Avatar,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";

import { DeleteUserModal } from "../Modal/User/DeleteUserModal";
import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUserStatus } from "../../../Utils/adminUsersService";
import Loader from "../../Loader/Loader";
import { StatusUserModal } from '../Modal/User/StatusUserModal.jsx';
import { toast } from "react-hot-toast";
   
const USER_STATUS = {
    ALL: "ALL",
    UNBLOCKED: "UNBLOCKED",
    BLOCKED: "BLOCKED",
};

const TABS = [
    { label: "All", value: USER_STATUS.ALL },
    { label: "Unblocked", value: USER_STATUS.UNBLOCKED },
    { label: "Blocked", value: USER_STATUS.BLOCKED },
];
   
  const TABLE_HEAD = ["No", "Customer", "Email", "Status", "Phone Number", "Delete"];
   
  export function UserTable() {

        const [isModalOpenDeleteUser, setIsModalOpenDeleteUser] = useState(false);
        const [users, setUsers] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [isModalOpenStatusUser, setIsModalOpenStatusUser] = useState(false);
        const [selectedUser, setSelectedUser] = useState(null);
        const [searchQuery] = useState("");
        const [filteredUsers, setFilteredUsers] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [selectedStatus, setSelectedStatus] = useState(USER_STATUS.ALL);
        const usersPerPage = 10;

        useEffect(() => {
            const fetchUsersData = async () => {
                setLoading(true);
                try {
                const statusFilter = selectedStatus === USER_STATUS.ALL ? "" : selectedStatus;
                    const usersData = await getUsers(currentPage, 10, statusFilter, searchQuery);
                    console.log("Fetched users response:", usersData);
                    setUsers(usersData.users);
                    setTotalPages(usersData.totalPages ); 

                } catch (err) {
                    setError("Error fetching users");
                    console.log(err);
                    
                } finally {
                    setLoading(false);
                }
            };
            fetchUsersData();
        }, [currentPage, selectedStatus, searchQuery]);
                
        useEffect(() => {
            let filtered = users;
       
            if (selectedStatus !== USER_STATUS.ALL) {
                filtered = users.filter((user) => user.status === selectedStatus);
            }
       
            if (searchTerm.trim() !== "") {
                filtered = filtered.filter((user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
       
            setFilteredUsers(filtered);
        }, [users, searchTerm, selectedStatus]);
       
            
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

        const handleNextPage = () => {
            if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        };
    
        const handlePreviousPage = () => {
            if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        };

        const handleDeleteUser = async (user) => {
            if (!user || !user._id) {
                console.error("Invalid user object:", user);
                return;
            }
            try {
                await deleteUser(user._id);
                setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
                toast.success("User deleted successfully");
            } catch (error) {
                toast.error("Failed to delete user");
                console.error(error);
            } finally {
                setIsModalOpenDeleteUser(false);
            }
        };

        const handleStatusUser = async (userId, currentStatus) => {
            const newStatus = currentStatus === "UNBLOCKED" ? "blocked" : "unblocked";
        
            try {
                const response = await updateUserStatus(userId, newStatus);
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, status: response.status } : user
                    )
                );
                toast.success("User status updated successfully");
                setIsModalOpenStatusUser(false);
            } catch (error) {
                console.error("Failed to update user status:", error);
            }
        };
        
    return (
        <Card className="h-full w-full ">
            {loading ? (
                <Loader />
            ) : error ? (
                <tr>
                    <td colSpan="6" className="text-center">{error}</td>
                </tr>
            ) : (
                <>
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            User Management
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all customers
                        </Typography>
                    </div>
                </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={selectedStatus} className="w-full md:w-max">
                    <TabsHeader>
                        {TABS.map(({ label, value }) => (
                        <Tab key={value} value={value} onClick={() => setSelectedStatus(value)}>
                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                        </Tab>
                        ))}
                    </TabsHeader>
                </Tabs>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="w-full md:w-72">
                            <Input
                                label="Search"
                                value={searchTerm} 
                                onChange={handleSearchChange} 
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            />
                        </div>
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
                        { filteredUsers.length > 0 ? (
                         filteredUsers.map((user, index)  => {
                            const isLast = index === users.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                const startIndex = (currentPage - 1) * usersPerPage;
                                const rowIndex = startIndex + index + 1;
            
                            return (
                                <tr key={user._id}>
                                <td className="py-3 px-4 text-center">{rowIndex}</td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                            >
                                            {user.name}
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
                                            {user.email}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="w-max">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={user.status}
                                            color={user.status === "UNBLOCKED" ? "green" : "red"}
                                            onClick={() => {
                                                if (user.name) {
                                                    setSelectedUser({ _id:user._id, name:user.name, email:user.email, status:user.status, phone:user.phone });
                                                    setIsModalOpenStatusUser(true);
                                                }
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {user.phone}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Tooltip content="Delete User">
                                    <IconButton 
                                        onClick={() => {
                                            setSelectedUser({ _id:user._id,name:user. name, email:user.email, status:user.status, phone:user.phone });
                                            setIsModalOpenDeleteUser(true);
                                        }}
                                        variant="text"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </IconButton>
                                    </Tooltip>
                                </td>
                                </tr>
                            );
                            })
                        ):(
                            <tr>
                                <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                                    <Typography variant="small" color="red" className="font-medium text-md">
                                        No user to display
                                    </Typography>

                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            </CardFooter>
            </>
            )}

            <DeleteUserModal
                open={isModalOpenDeleteUser}
                setOpen={setIsModalOpenDeleteUser}
                deleteUser={() => handleDeleteUser(selectedUser)} 
                user={selectedUser}
            />

            <StatusUserModal
                open={isModalOpenStatusUser}
                setOpen={setIsModalOpenStatusUser}
                user={selectedUser}
                handleStatusChange={handleStatusUser}
            />
      </Card>
    );
}