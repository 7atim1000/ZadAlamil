import Footer from "../../components/User/Home/Footer"
import FooterCopyright from "../../components/User/Home/FooterCopyRight"
import BannerMob from "../../components/User/Mobiles/BannerMob"
import Collections from "../../components/User/Mobiles/Collections"
import { ComplexNavbar } from "../../components/User/Home/Navbar"


const Mobiles = () => {
  return (
    <div className='bg-[#f6f6f6]'>
            <ComplexNavbar />
            <BannerMob />
            <Collections/>
            <Footer />
            <FooterCopyright />
    </div>
  )
}

export default Mobiles
