import React from "react";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionAction,
  AccordionContent,
  AccordionIcon,
  AccordionItem,
  AccordionTitle,
} from "keep-react";

import NewsletterForm from "./NewsletterForm.jsx";

import SocialMedia from "./SocialMedia.jsx";
import Skeleton from "react-loading-skeleton";
import useAuthUserStore from "../../store/AuthUserStore.js";

const Footer = () => {
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();
  const { user, logout } = useAuthUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login page after logout
  };

  if (GeneralInfoListError) {
    return (
      <div className="primaryTextColor  container md:mx-auto text-center p-3">
        <h1 className={"p-20"}>
          Something went wrong! Please try again later.
        </h1>
      </div>
    ); // Display error message
  }
  return (
    <div>
      {GeneralInfoListLoading ? (
        <>
          <div
            className={
              "grid grid-cols-2 md:grid-cols-4 gap-3 xl:container xl:mx-auto p-3"
            }
          >
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={200} width={"100%"} />
          </div>
          <Skeleton height={40} width={"100%"} />
        </>
      ) : (
        <>
          <div className={"secondaryBgColor  text-white"}>
            {" "}
            {/*Mobile Footer*/}
            <div className={"lg:hidden px-0 py-3"}>
              <Accordion flush={true} type="single" collapsible>
                {/*About Us Section*/}
                <AccordionItem value="value-1" style={{ borderBottom: "none" }}>
                  <AccordionAction style={{ paddingBottom: "10px" }}>
                    <AccordionTitle>About Us</AccordionTitle>
                    <AccordionIcon className="!text-green-500 !fill-green-500 !stroke-green-500" />
                  </AccordionAction>
                  <AccordionContent>
                    <div>
                      <p>{GeneralInfoList?.ShortDescription}</p>
                      <h1 className={"mb-3 mt-3"}>Follow Us</h1>
                      <SocialMedia />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/*My Account Section*/}
                <AccordionItem value="value-2" style={{ borderBottom: "none" }}>
                  <AccordionAction style={{ paddingBottom: "10px" }}>
                    <AccordionTitle>My Account</AccordionTitle>
                    <AccordionIcon className="!text-green-500 !fill-green-500 !stroke-green-500" />
                  </AccordionAction>
                  <AccordionContent>
                    <ul>
                      <li className={"hover:primaryTextColor"}>My Account</li>
                      <li className={"hover:primaryTextColor"}>My Orders</li>
                      <li className={"hover:primaryTextColor"}>My Wishlist</li>
                      <li className={"hover:primaryTextColor"}>
                        Payment History
                      </li>
                      <li className={"hover:primaryTextColor"}>
                        Support Tickets
                      </li>{" "}
                      <li className={"hover:primaryTextColor"}>
                        Promo/Coupons
                      </li>
                      {user ? (
                        <li
                          className={"cursor-pointer hover:primaryTextColor"}
                          onClick={handleLogout}
                        >
                          Logout
                        </li>
                      ) : (
                        <li className={"hover:primaryTextColor"}>Login</li>
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="value-3" style={{ borderBottom: "none" }}>
                  <AccordionAction style={{ paddingBottom: "10px" }}>
                    <AccordionTitle>Quick Links</AccordionTitle>
                    <AccordionIcon className="!text-green-500 !fill-green-500 !stroke-green-500" />
                  </AccordionAction>
                  <AccordionContent>
                    <ul>
                      <li className={"hover:primaryTextColor"}>About</li>
                      <li className={"hover:primaryTextColor"}>Blog</li>
                      <li className={"hover:primaryTextColor"}>
                        <Link
                          to="/contact-us"
                          className={"hover:primaryTextColor"}
                        >
                          Contact
                        </Link>
                      </li>

                      <li className={"hover:primaryTextColor"}>
                        Terms of Services
                      </li>
                      <li className={"hover:primaryTextColor"}>
                        Privacy Policy
                      </li>
                      <li className={"hover:primaryTextColor"}>
                        Refund Policy
                      </li>
                      <li className={"hover:primaryTextColor"}>
                        Shipping Policy
                      </li>
                      <li className={"hover:primaryTextColor"}>FAQ</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="value-4" style={{ borderBottom: "none" }}>
                  <AccordionAction style={{ paddingBottom: "10px" }}>
                    <AccordionTitle>Track Your Order</AccordionTitle>
                    <AccordionIcon className="!text-green-500 !fill-green-500 !stroke-green-500" />
                  </AccordionAction>
                  <AccordionContent>
                    <h1>Will work on it later</h1>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="value-5" style={{ borderBottom: "none" }}>
                  <AccordionAction style={{ paddingBottom: "10px" }}>
                    <AccordionTitle>Newsletter</AccordionTitle>
                    <AccordionIcon className="!text-green-500 !fill-green-500 !stroke-green-500" />
                  </AccordionAction>
                  <AccordionContent>
                    <h1>
                      Take advantage of our special offer. Do not worry, we
                      would not spam you.
                    </h1>
                    <NewsletterForm />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {/*Desktop Footer*/}
            <div
              className={
                "xl:container xl:mx-auto lg:grid grid-cols-1 lg:grid-cols-12 gap-10 justify-between py-10 px-6  hidden"
              }
            >
              <div className={"col-span-5 relative"}>
                <h1 className={"mb-3"}>
                  About Us
                  <span className="absolute left-0 top-6 w-15 border-b-2 border-gray-300 mt-1"></span>
                </h1>
                <p>{GeneralInfoList?.ShortDescription}</p>
                <h1 className={"mb-3 mt-3"}>Follow Us</h1>
                <SocialMedia />
              </div>

              <div className={"col-span-2 relative"}>
                <h1 className={"mb-3"}>
                  My Account
                  <span className="absolute left-0 top-6 w-15 border-b-2 border-gray-300 mt-1"></span>
                </h1>
                <ul>
                  <Link className={"hover:primaryTextColor"}>
                    <li>My Account</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>My Orders</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>My Wishlist</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Payment History</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Support Tickets</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Promo/Coupons</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    {user ? (
                      <li
                        className={"cursor-pointer hover:primaryTextColor"}
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    ) : (
                      <li className={"hover:primaryTextColor"}>Login</li>
                    )}
                  </Link>
                </ul>
              </div>
              <div className={"col-span-2 relative"}>
                <h1 className={"mb-3"}>
                  Quick Links
                  <span className="absolute left-0 top-6 w-15 border-b-2 border-gray-300 mt-1"></span>
                </h1>
                <ul>
                  <Link className={"hover:primaryTextColor"}>
                    <li>About</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Blog</li>
                  </Link>
                  <Link to="/contact-us" className={"hover:primaryTextColor"}>
                    <li>Contact</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Terms of Services</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Privacy Policy</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Refund Policy</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>Shipping Policy</li>
                  </Link>
                  <Link className={"hover:primaryTextColor"}>
                    <li>FAQ</li>
                  </Link>
                </ul>
              </div>
              {/*Newsletters*/}
              <div className={"col-span-3 relative "}>
                <h1 className={"mb-3"}>
                  Newsletters
                  <span className="absolute left-0 top-6 w-15 border-b-2 border-gray-200 mt-1"></span>
                </h1>

                <p>
                  Take advantage of our special offer. Do not worry, we would
                  not spam you
                </p>
                {/*Newsletters Form*/}
                <NewsletterForm />
              </div>
            </div>
            <div className={"text-center pb-5 pt-5"}>
              <p>{GeneralInfoList?.FooterCopyright}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
