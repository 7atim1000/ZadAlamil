import Img1 from '../../../assets/images/brand1.png';
import Img2 from '../../../assets/images/brand2.png';
import Img3 from '../../../assets/images/brand3.png';
import Img4 from '../../../assets/images/brand4.png';

const images = [Img1, Img2, Img3, Img4];

const AllBrandsComp = () => {
  return (
    <section className='bg-white p-2'>
        <div className='mt-32 md:mt-32 lg:mt-40'>
        <h2 className="text-2xl font-bold text-center mb-6 pt-10">ALL YOUR BRANDS</h2>
    
    <div className="flex justify-center items-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 ">
        {images.map((image, index) => (
          <div
            className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center "
            key={index}
          >
            <img src={image} alt={`service ${index + 1}`} className="w-32 h-32" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex justify-center items-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 ">
        {images.map((image, index) => (
          <div
            className="bg-[#f6f6f6] border-2 border-gray-200 p-4 flex justify-center items-center "
            key={index}
          >
            <img src={image} alt={`service ${index + 1}`} className="w-32 h-32" />
          </div>
        ))}
      </div>
    </div>
    </div>
    </section>
  );
};

export default AllBrandsComp;
