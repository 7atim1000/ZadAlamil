import { Typography } from "@material-tailwind/react";
import logo from '../../../assets/images/logo.png';
import { Link } from "react-router-dom";

import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
 
const LINKS = [
  {
    title: "Selling on Zad Alamil",
    items: ["Beginner’s Guide", "Fees & Pricing "],
  },
  {
    title: "Resources",
    items: ["FAQ", "Contact Us"],
  },
  {
    title: "Sellers",
    items: ["Login", "Signup"],
  },
];
 
const currentYear = new Date().getFullYear();
 
export function FooterWithSocialLinks() {
    return (
        <footer className="relative w-full mt-20 bg-[#868080]">
            <div className="mx-auto w-full max-w-7xl px-8 ">
                <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2 ">
                    <a href="#" className="mr-4 ml-2 cursor-pointer py-1.5 mt-20">
                        <Link to='/'><img src={logo} alt="company logo" className="h-12 w-auto"/></Link>
                        <h1 className="font-semibold">Zad Alamil</h1>
                    </a>
                    <div className="grid grid-cols-3 justify-between gap-4 mt-20">
                        {LINKS.map(({ title, items }) => (
                        <ul key={title}>
                            <Typography
                            variant="small"
                            color="white"
                            className="mb-3 font-medium opacity-40"
                            >
                            {title}
                            </Typography>
                            {items.map((link) => (
                            <li key={link}>
                                <Typography
                                as="a"
                                href="#"
                                color="white"
                                className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"
                                >
                                {link}
                                </Typography>
                            </li>
                            ))}
                        </ul>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
                    <Typography
                        variant="small"
                        className="mb-4 text-center font-normal text-gray-400 md:mb-0"
                    >
                        &copy; {currentYear} <a href="">Zad Alamil</a>. All
                        Rights Reserved.
                    </Typography>
                    <div className="flex gap-4 text-gray-400 sm:justify-center">
                        <FaFacebookF />
                        <FaXTwitter />
                        <FaLinkedinIn />
                        <FaInstagram />
                        <FaYoutube />
                    </div>
                </div>
            </div>
        </footer>
    );
}