import CreateAccount from "../../components/User/Seller/CreateAccount";
import { FooterWithSocialLinks } from "../../components/User/Seller/Footer";
import ProductListingSection from "../../components/User/Seller/ProductListingSection";
import SellerBanner from "../../components/User/Seller/SellerBanner";
import { NavbarWithMegaMenu } from "../../components/User/Seller/SellerNavbar"
import WhySellOnZad from "../../components/User/Seller/WhySellOnZad";


const SellerPage = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <NavbarWithMegaMenu />
        <SellerBanner />
        <WhySellOnZad />
        <CreateAccount />
        <ProductListingSection />
        <FooterWithSocialLinks />
    </div>
  )
}

export default SellerPage;
