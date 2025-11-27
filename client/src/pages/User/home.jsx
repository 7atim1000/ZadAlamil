
import Banner from '../../components/User/Home/Banner';
import BestSellers from '../../components/User/Home/bestTele';
import BrandsHome from '../../components/User/Home/Brands';
import CategorySection from '../../components/User/Home/CategorySection';
import Footer from '../../components/User/Home/Footer';
import FooterCopyright from '../../components/User/Home/FooterCopyRight';
import MobileBestSellers from '../../components/User/Home/mobileBest';
import MobileSection from '../../components/User/Home/MobileSection';
import NewArrivalMob from '../../components/User/Home/newArrivalMob';
import NewArrivals from '../../components/User/Home/newArrivalsTele';
import ServicesSection from '../../components/User/Home/serviceCard';
import TelevisionSection from '../../components/User/Home/television';
import ZadServices from '../../components/User/Home/zadServices';
import { ComplexNavbar } from '../../components/User/Home/Navbar';
import NewArrivalsTele from '../../components/User/Home/newArrivalsTele';


const Home = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        
        <Banner  />
        <CategorySection />
        <ServicesSection />
        <TelevisionSection />
        <BestSellers />
        {/* <NewArrivals /> */}
        <NewArrivalsTele />

        <MobileSection />
        <MobileBestSellers />
        <NewArrivalMob />
        <ZadServices />
        <BrandsHome />

        <Footer />
        <FooterCopyright />
        
      
    </div>
  )
}

export default Home;
