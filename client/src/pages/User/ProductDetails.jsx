
import Footer from '../../components/User/Home/Footer';
import FooterCopyright from '../../components/User/Home/FooterCopyRight';
import { ComplexNavbar } from '../../components/User/Home/Navbar'
import ProductDetails from '../../components/User/ProductDetails/produtDetails';

const ProductDetailsPage = () => {
  return (
    <div className='bg-[#f6f6f6]'>
        <ComplexNavbar />
        <ProductDetails />
        <Footer />
        <FooterCopyright/>
    </div>
  )
}

export default ProductDetailsPage
