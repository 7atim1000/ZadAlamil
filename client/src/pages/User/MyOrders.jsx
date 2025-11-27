
import Footer from '../../components/User/Home/Footer'
import FooterCopyright from '../../components/User/Home/FooterCopyRight'
import MyOrdersComp from '../../components/User/MyOrders/MyOrdersComp'
import { ComplexNavbar } from '../../components/User/Home/Navbar'

const MyOrders = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <MyOrdersComp />
        <Footer />
        <FooterCopyright/>
    </div>
  )
}

export default MyOrders
