import { FooterWithSocialLinks } from "../../components/User/Seller/Footer"
import { NavbarWithMegaMenu } from "../../components/User/Seller/SellerNavbar"
import SellerSubmit from "../../components/User/Seller/SellerSubmit"


const SellerSubmitPage = () => {
  return (
    <div className="bg-[#f5f5f5]">
        <NavbarWithMegaMenu />
        <SellerSubmit />
        <FooterWithSocialLinks />
    </div>
  )
}

export default SellerSubmitPage;