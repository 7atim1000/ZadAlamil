import Img1 from '../../../assets/images/service1.jpg';
import Img2 from '../../../assets/images/service2.png';
import Img3 from '../../../assets/images/service3.png';
import Img4 from '../../../assets/images/service4.png';

const images = [Img1, Img2, Img3, Img4];

const ZadServices = () => {
  return (
    <section>
        <h2 className="text-2xl font-bold text-center mb-6 mt-5">ZAD ALAMIL SERVICES</h2>
    
    <div className="flex justify-center items-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20">
        {images.map((image, index) => (
          <div
            className="border-2 border-black p-4 flex justify-center items-center "
            key={index}
          >
            <img src={image} alt={`service ${index + 1}`} className="w-44 h-44" />
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default ZadServices;
