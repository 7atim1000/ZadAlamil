// import Home from "./pages/HOME.JSX";
// import Home from  './pages/User/home.jsx';
import Home from  './pages/User/home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mobiles from './pages/User/Mobiles.jsx';
import ProductDetailsPage from './pages/User/ProductDetails.jsx';
import Cart from './pages/User/Cart.jsx';
import Wishlist from './pages/User/Wishlist.jsx';
import NewArrivals from './pages/User/NewArrivals.jsx';
import OrderConfirm from './pages/User/OrderConfirm.jsx';
import Checkout from './pages/User/Checkout.jsx';
import OrderDetails from './pages/User/OrderDetails.jsx';
import Profile from './pages/User/Profile.jsx';
import MyOrders from './pages/User/MyOrders.jsx';
import Login from './pages/User/Login.jsx';
import Signup from './pages/User/Signup.jsx';
import NumberLogin from './pages/User/NumberLogin.jsx';
import OTP from './pages/User/OTP.jsx';
import ForgetPassword from './pages/User/ForgetPassword.jsx';
import ForgotOTPNumber from './pages/User/ForgotOTPNumber.jsx';
import ChangePassword from './pages/User/ChangePassword.jsx';
import AllBrands from './pages/User/AllBrands.jsx';

import AdminLogin from './pages/Admin/Login.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import ProductManagement from './pages/Admin/ProductManage.jsx';
import CategoryManagement from './pages/Admin/CategoryManage.jsx';
import CouponManagement from './pages/Admin/CouponManage.jsx';
import UserManagement from './pages/Admin/UserManage.jsx';
import BannerManagement from './pages/Admin/Bannermanage.jsx';
import Vendormanagement from './pages/Admin/VendorManage.jsx';
import SellerPage from './pages/User/Seller.jsx';
import ScrollToTop from './components/ScrollTop/ScrollTop.jsx';
import SellerFormPage from './pages/User/SellerForm.jsx';
import SellerFormSubmitPage from './pages/User/SellerViewForm.jsx';
import SellerSubmitPage from './pages/User/SellerSubmitPage.jsx';
import VendorLoginPage from './pages/Vendor/Login.jsx';
import VendorDashboardPage from './pages/Vendor/Dashboard.jsx';
import ProductManagementVendorPage from './pages/Vendor/ProductManagementVendorPage.jsx';
import CategoryManagementVendorPage from './pages/Vendor/CategoryVendorManage.jsx';
import OrderManagementVendorPage from './pages/Vendor/OrderVendorManage.jsx';
import OrderDetailsVendorPage from './pages/Vendor/OrderDetailsVendorPage.jsx';
import BrandManagement from './pages/Admin/BrandManage.jsx';
import Loader from './components/Loader/Loader.jsx';
import { useSelector } from 'react-redux';
import ApprovedVendorManagement from './pages/Admin/ApprovedVendor.jsx';

import ProductsCategory from './pages/User/ProductsCategory.jsx';
import CheckOutCart from './components/User/Checkout/CheckOutCart.jsx';

const App = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <Router>
        <ScrollToTop />
        { isLoading && <Loader /> }
      <Routes>

        {/* USER SIDE */}
        <Route path="/" element={<Home/>} /> 
        <Route path="/mobiles&tabs" element={<Mobiles/>} /> 
        <Route path="/products-category" element={<ProductsCategory />} /> 
        {/* <Route path="/products-category/:categoryId" element={<ProductsCategory />} /> */}
        <Route path="/all-brands" element={<AllBrands/>} /> 
        <Route path='/product-details' element={ <ProductDetailsPage />} />
        <Route path='/cart' element={ <Cart />} />
        <Route path='/wishlist' element={ <Wishlist />} />
        <Route path='/new-arrivals' element={ <NewArrivals />} />
        {/* <Route path='/checkout' element={ <Checkout />} /> */}
        <Route path='/checkout' element={ <CheckOutCart />} />
        <Route path='/order-confirm' element={ <OrderConfirm />} />
        {/* <Route path='/order-details' element={ <OrderDetails />}/> */}
        <Route path='/order-details/:orderId' element={<OrderDetails />}/>
        <Route path='/profile' element={ <Profile />} />
        <Route path='/my-orders' element={ <MyOrders />} />

        <Route path='/login' element={ <Login />}/>
        <Route path='/numberLogin' element={ <NumberLogin />}/>
        <Route path='/otp-login' element={ <OTP />}/>

        <Route path='/signup' element={ <Signup />}/>

        <Route path='/forgot-password' element={ <ForgetPassword />} />
        <Route path='/forgot-OTP-number' element={ <ForgotOTPNumber />} />
        <Route path='/change-password' element={ <ChangePassword />}/>

        {/* ADMIN */}
        <Route path='/admin/admin-login' element={ <AdminLogin />} />
        <Route path='/admin/dashboard' element={ <Dashboard />} />
        <Route path='/admin/product-management' element={ <ProductManagement />} />
        <Route path='/admin/category-management' element={ <CategoryManagement />} />
        <Route path='/admin/coupon-management' element={ <CouponManagement />} />
        <Route path='/admin/user-management' element={ <UserManagement />} />
        <Route path='/admin/banner-management' element={ <BannerManagement />} />
        <Route path='/admin/vendor-management' element={ <Vendormanagement />} />
        <Route path='/admin/brand-management' element={ <BrandManagement />} />
        <Route path='/admin/approved-vendors' element={ <ApprovedVendorManagement />} />


        {/* SELLER */}
        <Route path='/seller' element={ <SellerPage />} />
        <Route path='/seller-form' element={ <SellerFormPage />} />
        <Route path='/seller-submit' element={ <SellerSubmitPage />} />
        <Route path='/seller-form-view' element={ <SellerFormSubmitPage />} />

        {/* VENDOR */}
        <Route path='/vendor/vendor-login' element={ <VendorLoginPage />}/>
        <Route path='/vendor/vendor-dashboard' element={ <VendorDashboardPage />}/>
        {/* <Route path='/vendor/vendor-dashboard' element={ <VendorDashboardPage />}/> */}
        <Route path='/vendor/vendor-productManagement' element={ <ProductManagementVendorPage />}/>
        <Route path='/vendor/vendor-categoryManagement' element={ <CategoryManagementVendorPage />}/>
        <Route path='/vendor/vendor-orderManagement' element={ <OrderManagementVendorPage />}/>
        <Route path='/vendor/order-details/:orderId' element={ <OrderDetailsVendorPage />}/>
        


      </Routes>
    </Router>
  )
}

export default App
