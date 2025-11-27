// Payment getway
import React,{useEffect, useState} from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
  Bars3Icon
} from "@heroicons/react/24/solid";
import {
  HeartIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/outline";
import logo from '../../../assets/images/logo.png';
import login from "../../../assets/images/login.png";

import Img1 from '../../../assets/images/brand11.png';
import Img2 from '../../../assets/images/brand12.png';
import Img3 from '../../../assets/images/brand13.png';
import Img4 from '../../../assets/images/brand14.png';
import Img5 from '../../../assets/images/brand15.png';
import Img6 from '../../../assets/images/brand16.png';

import { Link,useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import axios from "../../../Utils/BaseUrl.js";
import { setTokens } from "../../../Redux/reducer/userReducer";
import { toast } from 'react-hot-toast';

import { getCategories, getCategoriesPublic } from "../../../Utils/userCategoryService.js";
// import { userCartCount } from "../../../hooks/userCartCount.js";
import { getUserCart } from "../../../Utils/userCartService.js";
 
function ProfileMenu() {
  
  const dispatch = useDispatch();
  const navigate =  useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  var user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.token) {
      const token = localStorage.getItem('userAccessToken');
      if (token) {
        dispatch(setTokens(token));
      }
    }
  }, [user.token, dispatch]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("userAccessToken");
      if (!token) {
        console.error("No token found, unable to log out");
        return;
      }
  
      await axios.post(
        "/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      dispatch(logoutUser());
      localStorage.removeItem("userAccessToken");
      toast.success("Sign Out successfully");
      navigate("/login");
      console.log("Sign out successful");
  
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
  
      if (error.response?.data?.message === "Token has expired") {
        console.warn("Token expired. Forcing logout...");
        dispatch(logoutUser());
        localStorage.removeItem("userAccessToken");
        toast.success("Sign Out successfully");
        navigate("/login", { state: { message: "Session expired. Please log in again." } });

      }
    }
  };
  
 
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto "
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

       {/*If user login or not */} 
      {user.token ? (
  <>
    <Link to="/profile">
      <MenuItem
        onClick={() => console.log("My Profile clicked")}
        className="flex items-center gap-2 rounded"
      >
        <UserCircleIcon className="h-4 w-4" strokeWidth={2} />
        <Typography as="span" variant="small" className="font-normal">
          My Profile
        </Typography>
      </MenuItem>
    </Link>
    <MenuItem
      onClick={() => {
        console.log("Sign Out clicked");
        handleLogout();
      }}
      className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
    >
      <PowerIcon className="h-4 w-4 text-red-500" strokeWidth={2} />
      <Typography
        as="span"
        variant="small"
        className="font-normal"
        color="red"
      >
        Sign Out
      </Typography>
    </MenuItem>
  </>
) : (
  <Link to="/login">
    <MenuItem onClick={closeMenu} className="flex items-center gap-2 rounded">
      <Typography as="span" variant="small" className="font-normal">
        Sign In
      </Typography>
    </MenuItem>
  </Link>
)}
  
  <Link to="/admin/dashboard">
    <MenuItem onClick={closeMenu} className="flex items-center gap-2 border-t border-gray-800 mt-3">
      <Typography as="span" variant="small" className="font-normal">
        Admin
      </Typography>
    </MenuItem>
  </Link>
  <Link to="/vendor/vendor-dashboard">
    <MenuItem onClick={closeMenu} className="flex items-center gap-2 border-t border-gray-800">
      <Typography as="span" variant="small" className="font-normal">
        Vendors
      </Typography>
    </MenuItem>
  </Link>
  
</MenuList>

    </Menu>
  );

}
 
// nav list menu
const navListMenuItems = [
  {
    title: "All",
  },
  {
    title: "Brands",
  },
  {
    title: "New Arrivals",
  },
];
 
function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
 
  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));
 
  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}
 
function NavList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
    </ul>
  );
}

export function SecondaryNavbar() {
  // const token = useSelector((state) => state.auth.token);
  const token = localStorage.getItem("userAccessToken");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Proteced API:-
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     // Don't fetch if no token (user not logged in)
  //     if (!token) {
  //       console.log("No user token found, skipping categories fetch");
  //       setCategories([]);
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       console.log("Fetching categories with token...");
        
  //       const data = await getCategories();
  //       console.log("Categories data received:", data);
        
  //       // Make sure we're accessing the right property
  //       const categoriesArray = data.categories || data || [];
        
  //       const mappedCategories = categoriesArray.map((cat) => ({
  //         categoryName: cat.name,
  //         categoryId: cat._id,
  //         status: cat.status?.toUpperCase() === "LIST",
  //       }));

  //       console.log("Mapped categories:", mappedCategories);
  //       setCategories(mappedCategories);
        
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
        
  //       // Safe error message check
  //       const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
  //       // Don't show error toast for unauthorized users or token issues
  //       if (!errorMessage.includes("No authentication token") && 
  //           !errorMessage.includes("invalid or expired") &&
  //           !errorMessage.includes("Unauthorized")) {
  //         toast.error("Failed to fetch categories");
  //       }
        
  //       setCategories([]);
  //     } finally {
  //       setLoading(false);
  //     }
     
  //   };

  //   fetchCategories();
  //  }, [token]);


  // Public API
   useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        console.log("Fetching categories...");
        
        let data;
        
        if (token) {
          // User is logged in - use protected API
          console.log("User is authenticated, using protected API");
          data = await getCategoriesPublic();
        } else {
          // User is not logged in - use public API
          console.log("User is not authenticated, using public API");
          data = await getCategoriesPublic();
        }
        
        console.log("Categories data received:", data);
        
        // Make sure we're accessing the right property
        const categoriesArray = data.categories || data || [];
        
        const mappedCategories = categoriesArray.map((cat) => ({
          categoryName: cat.name,
          categoryId: cat._id,
          status: cat.status?.toUpperCase() === "LIST",
        }));

        console.log("Mapped categories:", mappedCategories);
        setCategories(mappedCategories);
        
      } catch (error) {
        console.error("Error fetching categories:", error);
        
        // Safe error message check
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
        // Only show toast for unexpected errors (not auth-related)
        if (!errorMessage.includes("No authentication token") && 
            !errorMessage.includes("invalid or expired") &&
            !errorMessage.includes("Unauthorized")) {
          toast.error("Failed to fetch categories");
        }
        
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]); // This will refetch when login status changes



  // useEffect(() => {
  //         if (token) {
  //             //setLoading(true);
  //             const fetchCategories = async () => {
  //                 try {
  //                     const { categories: fetchedCategories } = await getCategories();
  //                     // const mappedCategories = fetchedCategories.map((cat) => ({
  //                     //     categoryName: cat.name,
  //                     //     categoryId: cat._id,
  //                     //     status: cat.status?.toUpperCase() === "LIST",
  //                     // }));
  //                   const mappedCategories = fetchedCategories.map((cat) => ({
  //                     categoryName: cat.name,        // This is correct
  //                     categoryId: cat._id,
  //                     status: cat.status?.toUpperCase() === "LIST",
  //                   }));
  
  //                     setCategories(mappedCategories);
  //                     // setTotalCategories(total); 
  //                     // setLoading(false);
  //                 } catch (error) {
  //                     toast.error("Failed to fetch categories");
  //                     console.error("Error fetching categories:", error);
  //                     //setLoading(false);
  //                 }
  //             };
  //             fetchCategories();
  //         }
  //     }, [token]);
    

    return (
      <Navbar className="hidden lg:flex bg-[#f6f6f6] py-2 px-6 max-w-none rounded-none fixed top-16 z-40">
        <div className="flex justify-center items-center w-full gap-80">
          {/* Left Section */}
          <div className="flex items-center gap-1">
            <Menu 
              dismiss={{
              itemPress: false,
              outsidePress: false,
            }}
          >
          <MenuHandler>
            <div className="flex items-center gap-1 cursor-pointer">
              <Bars3Icon className="h-6 w-6 text-black hover:text-blue-500" />
              <Typography
                as="a"
                href="#all"
                variant="small"
                className="font-medium text-black hover:text-blue-500"
              >
                All
              </Typography>
            </div>
          </MenuHandler>
          <MenuList className="bg-[#f6f6f6] border border-gray-200 shadow-lg rounded-md">
            {categories.map((category) => (
              <MenuItem key={category.categoryId} className="cursor-pointer hover:text-blue-500" >
                <Typography
                  as="a"
                  // href={`#category-${category.categoryId}`}
                  href ={`/products-category?categoryId=${category.categoryId}`}
                  
                  className="font-medium text-black"
                >
                {category.categoryName} 
                  
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        </div>

        {/* centre */}
        <Menu
          dismiss={{
            itemPress: false,
            outsidePress: false,
          }}
        >
          <MenuHandler>
            <Typography
              as="a"
              href="#brands"
              variant="small"
              className="font-medium text-black cursor-pointer hover:text-blue-500"
            >
              Brands
            </Typography>
          </MenuHandler>
          <MenuList className="bg-[#f6f6f6] border border-gray-200 shadow-lg rounded-md p-4 w-[900px]">
            <div className="grid grid-cols-[60%_40%] gap-4">
              <div className="border-r pr-4">
                <h3 className="text-lg font-bold mb-3 text-black">Popular Brands</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 ">
                  <div className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center">
                    <img src={Img1} alt="Brand1" />
                  </div>
                  <div className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center">
                    <img src={Img2} alt="Brand2" />
                  </div>
                  <div className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center">
                    <img src={Img3} alt="Brand3" />
                  </div>
                  <div className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center">
                    <img src={Img4} alt="Brand4" />
                  </div>
                  <div className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center">
                    <img src={Img5} alt="Brand5" />
                  </div>
                  <div className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center">
                    <img src={Img6} alt="Brand6" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-black">All Brands</h3>
                <Input
                  type="text"
                  placeholder="Search Brands"
                  className="mb-3"
                />
                <div className="h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-5 mb-7 text-base">
                  {["Samsung", "Huawei", "Apple", "Honor", "Vivo", "OnePlus", "Huawei", "Apple", "Honor", "Vivo", "OnePlus"].map(
                    (brand) => (
                      <p
                        key={brand}
                        className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {brand}
                      </p>
                    )
                  )}
                </div>
                <Link to='/all-brands'>
                <p className="mt-3 text-[#972323] font-bold cursor-pointer hover:underline text-base">
                  See All Brands &gt;
                </p>
                </Link>
              </div>
            </div>
          </MenuList>
        </Menu>

          {/* Right Section */}
          <Link to='/new-arrivals'>
            <Typography
              as="a"
              href="#new-arrivals"
              variant="small"
              className="font-medium text-black cursor-pointer hover:text-blue-500"
            >
              New Arrivals
            </Typography>
          </Link>
        </div>
      </Navbar>
    );
}
 
export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  // Start userCartCount
  // const { cartCount, loading } = userCartCount();
   const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);

  // const fetchCartCount = async () => {
  //   try {
  //     setCartLoading(true);
  //     const token = localStorage.getItem("userAccessToken");
  //     console.log(" Debug - Token found:", !!token);

  //     if (!token) {
  //       console.log(" Debug - No token, setting cart count to 0");
  //       setCartCount(0);
  //       setCartLoading(false);
  //       return;
  //     }

  //     console.log(" Debug - Fetching cart data...");
  //     const response = await getUserCart();
  //     console.log("Debug - Cart API response:", response);

  //     if (response.success && response.cart) {
  //       console.log("Debug - Cart items:", response.cart.items);
  //       const totalItems = response.cart.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
  //       console.log(" Debug - Total items calculated:", totalItems);
  //       setCartCount(totalItems);
  //     } else {
  //       console.log("Debug - No cart data in response, setting to 0");
  //       setCartCount(0);
  //     }
  //   } catch (error) {
  //     console.error(' Debug - Error fetching cart count:', error);
  //     console.log("Debug - Error details:", error.message);
  //     setCartCount(0);
  //   } finally {
  //     console.log("Debug - Setting loading to false");
  //     setCartLoading(false);
  //   }
  // };
  const fetchCartCount = async () => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem("userAccessToken");
      console.log("Debug - Token found:", !!token);

      if (!token) {
        console.log("Debug - No token, setting cart count to 0");
        setCartCount(0);
        setCartLoading(false);
        return;
      }

      console.log("Debug - Fetching cart data...");
      const response = await getUserCart();
      console.log("Debug - Cart API response:", response);

      // UPDATED: Check for cartItems instead of cart
      if (response.success && response.cartItems) {
        console.log("Debug - Cart items:", response.cartItems);
        const totalItems = response.cartItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
        console.log("Debug - Total items calculated:", totalItems);
        setCartCount(totalItems);
      } else {
        console.log("Debug - No cart data in response, setting to 0");
        console.log("Debug - Reason: success=", response.success, "cartItems=", response.cartItems);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Debug - Error fetching cart count:', error);
      console.log("Debug - Error details:", error.message);
      setCartCount(0);
    } finally {
      console.log("Debug - Setting loading to false");
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // Debug the current state
  //console.log(" Debug - Current state - cartCount:", cartCount, "cartLoading:", cartLoading);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);
 
  return (
    <>
    <Navbar className="max-w-none rounded-none z-50 bg-[#f6f6f6] h-16 fixed">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">

        {/* Logo */}

        <a href="#" className="mr-4 ml-2 cursor-pointer -mt-2">
        <Link to='/'><img src={logo} alt="company logo" className="h-8 w-auto"/></Link>
          <h1 className="font-semibold -ml-2 text-sm">Zad Alamil</h1>
        </a>

          {/* search */}

        <div className="hidden lg:flex flex-grow justify-center">
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              placeholder="find your product here...."
              containerProps={{
                className: "min-w-[480px]",
              }}
              className=" !border-t-blue-gray-300 pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="!absolute left-3 top-[13px]">
              <svg
                width="13"
                height="14"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
                  fill="#CFD8DC"
                />
                <path
                  d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                  stroke="#CFD8DC"
                  // stroke-width="2"
                  // stroke-linecap="round"
                  // stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          </div>
       
        <div className="hidden lg:block">
          <NavList />
        </div>

        {/* Wishlist */}

      <div className="flex items-center gap-5">

        <Link to='/wishlist'><IconButton variant="text" color="black">
          <HeartIcon className="h-6 w-6" />
        </IconButton>
        </Link>
        
        {/*CART ICON */}

        {/* <Link to='/cart'><IconButton variant="text" color="black" className="mr-4">
          <ShoppingCartIcon className="h-6 w-6 " />
        </IconButton>
        </Link> */}
          {/* UPDATED CART ICON WITH COUNT */}
          <Link to='/cart' className="relative">
            <IconButton variant="text" color="black" className="mr-4">
              <ShoppingCartIcon className="h-6 w-6" />
            </IconButton>
            
            {/* Cart Badge - ALWAYS SHOW FOR DEBUGGING */}
           
            <span className={`
              absolute -top-2 right-2 
              bg-red-700 text-white text-xs font-bold 
              rounded-full h-5 w-5 flex items-center justify-center
              animate-pulse shadow-lg
              ${cartCount > 9 ? 'text-[10px]' : 'text-xs'}
            
            `}>
              {cartLoading ? '?' : (cartCount > 99 ? '99+' : cartCount)}
            </span>
            
            {/* Debug info - remove after testing */}
            <div className="absolute -bottom-8 -right-2 bg-yellow-100 text-xs p-1 rounded border hidden">
              Count: {cartCount} | Loading: {cartLoading ? 'Yes' : 'No'}
            </div>
          </Link>

      </div>

        <IconButton

          size= "sm"
          color= "blue-gray"
          variant= "text"
          onClick= {toggleIsNavOpen}
          className= "ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className= "h-6 w-6" />

        </IconButton>
 
        {/* <Button size="sm" variant="text">
          <span>Log In</span>
        </Button> */}
        <ProfileMenu />
      </div>
      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>
    </Navbar>
    <SecondaryNavbar/>
    </>
  );
}