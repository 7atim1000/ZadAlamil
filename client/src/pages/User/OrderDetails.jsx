
import Footer from '../../components/User/Home/Footer'
import FooterCopyright from '../../components/User/Home/FooterCopyRight'
import { ComplexNavbar } from '../../components/User/Home/Navbar'
import OrderDetailsComp from '../../components/User/OrderDetails/OrderDetailsComp'

const OrderDetails = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar/>
        <OrderDetailsComp />
        <Footer />
        <FooterCopyright />
      
    </div>
  )
}

export default OrderDetails
