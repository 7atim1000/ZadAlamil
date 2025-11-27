import React from "react";
import { PropTypes } from 'prop-types';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { InputCustomStyles } from "./Input";
import { ButtonSizesMob } from "../Buttons/ButtonMob";
import { RadioCustomIcon } from "../Buttons/RadioButtons";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

Icon.propTypes = {
    id: PropTypes.string.isRequired,  
    open: PropTypes.string.isRequired,
  };
  
export const Filters = () => {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className="space-y-6 bg-black">
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader className="text-blue-gray-200 text-lg" onClick={() => handleOpen(1)}>Categories</AccordionHeader>
        <AccordionBody>
          <ul className="space-y-2 text-base ml-4 cursor-pointer text-blue-gray-200">
            <li>Android</li>
            <li>iPhone</li>
            <li>Flagships</li>
            <li>Huawei Smartphones</li>
            <li>OnePlus Smartphones</li>
            <li>Oppo Smartphones</li>
            <li>TCL Smartphones</li>
            <li>Honor Smartphones</li>
          </ul>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
        <AccordionHeader className="text-blue-gray-200 text-lg" onClick={() => handleOpen(2)}>Price Range</AccordionHeader>
        <AccordionBody>
          <div className="flex justify-between mb-4">
            <h3><InputCustomStyles /></h3>
            <h3 className="font-light mt-3 ml-3 text-blue-gray-200">To</h3>
            <h3 className="mr-2"><InputCustomStyles /></h3>
            <h3 className="mr-3 mt-1"><ButtonSizesMob /></h3>
        </div>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
        <AccordionHeader className="text-blue-gray-200 text-lg" onClick={() => handleOpen(3)}>RAM</AccordionHeader>
        <AccordionBody>
          <RadioCustomIcon />
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
        <AccordionHeader className="text-blue-gray-200 text-lg" onClick={() => handleOpen(4)}>SIM</AccordionHeader>
        <AccordionBody>
          <ul className="space-y-2 text-base ml-4 cursor-pointer text-blue-gray-200">
            <li>Micro SIM</li>
            <li>Nano SIM</li>
            <li>Hybrid Dual SIM</li>
            <li>Dual SIM</li>
          </ul>
        </AccordionBody>
      </Accordion>
    </div>
  );
};
