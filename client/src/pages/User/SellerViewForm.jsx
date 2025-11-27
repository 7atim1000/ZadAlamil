import { FooterWithSocialLinks } from "../../components/User/Seller/Footer";
import SellerFormView from "../../components/User/Seller/SellerFormView";
import { NavbarWithMegaMenu } from "../../components/User/Seller/SellerNavbar";

const SellerFormSubmitPage = () => {
  return (
    <div className="bg-[#f5f5f5]">
        <NavbarWithMegaMenu />
        <SellerFormView />
        <FooterWithSocialLinks />
    </div>
  )
}

export default SellerFormSubmitPage;