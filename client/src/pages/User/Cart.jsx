import ShoppingCart from "../../components/User/CartComponent/CartComp"
import Footer from "../../components/User/Home/Footer"
import FooterCopyright from "../../components/User/Home/FooterCopyRight"
import { ComplexNavbar } from "../../components/User/Home/Navbar"


const Cart = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <ShoppingCart />
        <Footer />
        <FooterCopyright />
    </div>
  )
}

export default Cart
