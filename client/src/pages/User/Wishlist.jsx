import Footer from "../../components/User/Home/Footer"
import FooterCopyright from "../../components/User/Home/FooterCopyRight"
import { ComplexNavbar } from "../../components/User/Home/Navbar"
import WishlistComp from "../../components/User/Wishlist/WishlistComp"

const Wishlist = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <WishlistComp />
        <Footer />
        <FooterCopyright />
    </div>
  )
}

export default Wishlist
