import { Typography } from "@material-tailwind/react";
import Img1 from '../../../assets/images/24 hours.png';
import Img2 from '../../../assets/images/easy return.png';
import Img3 from '../../../assets/images/secure payments.png';
import Img4 from '../../../assets/images/warranty.png';
import PropTypes from "prop-types";


const serviceData = [
    { name: "24 Hours Delivery & Installation", image: Img1 },
    { name: "Easy Returns", image: Img2 },
    { name: "Secure Payments", image: Img3 },
    { name: "Extended Warranty", image: Img4 },
  ];
  
  const ServiceCard = ({ image, name }) => {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <img src={image} alt={name} className="w-16 h-16 object-contain" />
        <Typography variant="h6" className="font-semibold text-black">
          {name}
        </Typography>
      </div>
    );
  };

  ServiceCard.propTypes = {
    image: PropTypes.string.isRequired, 
    name: PropTypes.string.isRequired, 
  };
  
  const ServicesSection = () => {
    return (
      <section className="w-full py-8 bg-gradient-to-r from-[#1D0F0F] to-[#972323] bg-center mb-10">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {serviceData.map((service, index) => (
              <ServiceCard key={index} image={service.image} name={service.name} />
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default ServicesSection;
