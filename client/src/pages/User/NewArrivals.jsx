import Footer from "../../components/User/Home/Footer"
import FooterCopyright from "../../components/User/Home/FooterCopyRight"
import { ComplexNavbar } from "../../components/User/Home/Navbar"
import NewArrivalsComp from "../../components/User/NewArrivals/NewArrivalsComp"

const NewArrivals = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <NewArrivalsComp />
        <Footer />
        <FooterCopyright />
    </div>
  )
}

export default NewArrivals
