
import CheckoutComp from '../../components/User/Checkout/CheckoutComp'
import Footer from '../../components/User/Home/Footer'
import FooterCopyright from '../../components/User/Home/FooterCopyRight'
import { ComplexNavbar } from '../../components/User/Home/Navbar'

const Checkout = () => {
  return (
    <div className='bg-[#f6f6f6]'>
            <ComplexNavbar />
            <CheckoutComp />
            <Footer />
            <FooterCopyright />
    </div>
  )
}

export default Checkout
