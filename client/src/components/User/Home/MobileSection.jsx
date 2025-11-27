import Img1 from "../../../assets/images/MOBILE2.jpg";
import Img2 from "../../../assets/images/MOBILE.png";
import PropTypes from "prop-types";

const mobileData = [{ image: Img1 }, { image: Img2 }];

const MobileCard = ({ image }) => {
  return (
    <div className="flex items-center justify-center">
      <img
        src={image}
        alt="Television"
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
    </div>
  );
};

MobileCard.propTypes = {
  image: PropTypes.string.isRequired,
};

const MobileSection = () => {
  return (
    <section className="w-full py-10 px-5 bg-gray-100">
        <div><h1 className="text-[#972323] text-xl font-bold">MOBILES</h1></div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mobileData.map((item, index) => (
            <MobileCard key={index} image={item.image} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileSection;
