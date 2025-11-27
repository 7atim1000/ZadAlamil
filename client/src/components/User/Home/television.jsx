import { useState, useEffect } from 'react';
import Img1 from "../../../assets/images/tv1.jpg";
import Img2 from "../../../assets/images/tv2.jpg";
import PropTypes from "prop-types";


const televisionData = [{ image: Img1 }, { image: Img2 }];

const TelevisionCard = ({ image }) => {
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

TelevisionCard.propTypes = {
  image: PropTypes.string.isRequired,
};



const TelevisionSection = () => {
  return (
    <section className="w-full py-10 px-5 bg-gray-100">
        <div><h1 className="text-[#972323] text-xl font-bold">TELEVISIONS</h1></div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {televisionData.map((item, index) => (
            <TelevisionCard key={index} image={item.image} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TelevisionSection;
