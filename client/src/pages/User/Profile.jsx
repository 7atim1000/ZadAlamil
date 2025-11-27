import Footer from "../../components/User/Home/Footer"
import FooterCopyright from "../../components/User/Home/FooterCopyRight"
import { ComplexNavbar } from "../../components/User/Home/Navbar"
import ProfileComp from "../../components/User/Profile/ProfileComp"

const Profile = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <ProfileComp />
        <Footer />
        <FooterCopyright />
    </div>
  )
}

export default Profile
