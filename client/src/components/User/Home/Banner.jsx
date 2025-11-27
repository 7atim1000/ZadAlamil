import banner1 from '../../../assets/images/banner1.jpg';
import { ButtonDefault } from './Button';

const Banner = () => {
  return (
    <section>
        <div className="flex items-center justify-center h-[900px] mb-[-90px]">
            <div className="w-full ml-7 mr-7 h-[500px] sm:h-[400px] lg:h-[500px] xl:h-[600px] bg-cover 
            bg-center rounded-md flex flex-col items-center justify-center" style={{ backgroundImage: `url(${banner1})` }}>
                <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">
                    New Arrival laptops
                </h1>
                <ButtonDefault className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] 
                mt-4 px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold">
                </ButtonDefault>
            </div>
          
        </div>
    </section>
  );
};

export default Banner;
