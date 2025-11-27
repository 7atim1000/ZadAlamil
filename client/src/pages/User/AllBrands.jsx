import AllBrandsComp from '../../components/User/AllBrands/AllBrandsComp'
import Footer from '../../components/User/Home/Footer'
import FooterCopyright from '../../components/User/Home/FooterCopyRight'
import { ComplexNavbar } from '../../components/User/Home/Navbar'

const AllBrands = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <AllBrandsComp />
        <Footer />
        <FooterCopyright />
    </div>
  )
}

export default AllBrands
