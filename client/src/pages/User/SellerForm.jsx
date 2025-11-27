import { FooterWithSocialLinks } from "../../components/User/Seller/Footer";
import SellerForm from "../../components/User/Seller/SellerForm"
import { NavbarWithMegaMenu } from "../../components/User/Seller/SellerNavbar";

const SellerFormPage = () => {
  return (
    <div className="bg-[#f5f5f5]">
        <NavbarWithMegaMenu />
        <SellerForm />
        <FooterWithSocialLinks />
    </div>
  )
}

export default SellerFormPage;