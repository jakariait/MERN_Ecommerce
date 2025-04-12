import React, { useState, useRef, useEffect } from "react";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";
import { MdEmail } from "react-icons/md";
import { TfiTruck } from "react-icons/tfi";
import ImageComponent from "./ImageComponent.jsx";
import { CiSearch } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import MenuBar from "./MenuBar.jsx";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import MobileMenu from "./MobileMenu.jsx";
import useCartStore from "../../store/useCartStore.js";
import useAuthUserStore from "../../store/AuthUserStore.js";
import Cart from "./Cart.jsx";

const Headers = () => {
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();

  const { user, logout } = useAuthUserStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const cartButtonRef = useRef(null);
  const { cart } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login page after logout
  };

  const handleCloseCartMenu = () => {
    setIsCartMenuOpen(false);
  };
  // Function to handle click outside the menu
  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
    if (
      cartMenuRef.current &&
      !cartMenuRef.current.contains(event.target) &&
      !cartButtonRef.current.contains(event.target)
    ) {
      setIsCartMenuOpen(false);
    }
  };

  // Add event listener to detect outside clicks when menu is open
  useEffect(() => {
    if (isMenuOpen || isCartMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isCartMenuOpen]);

  const prevCartCount = useRef(
    cart.reduce((total, item) => total + item.quantity, 0),
  );

  useEffect(() => {
    const currentCartCount = cart.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    if (currentCartCount > prevCartCount.current) {
      setIsCartMenuOpen(true); // Open cart only when quantity increases
    }

    prevCartCount.current = currentCartCount; // Update previous cart count
  }, [cart]);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (GeneralInfoListError) {
    return (
      <div className="primaryTextColor container md:mx-auto text-center p-3">
        <h1>Something went wrong! Please try again later.</h1>
      </div>
    );
  }

  return (
    <div>
      {GeneralInfoListLoading ? (
        <div className={"xl:container xl:mx-auto p-3"}>
          <Skeleton height={40} width={"100%"} />
          <Skeleton height={60} width={"100%"} />
          <Skeleton height={40} width={"100%"} />
        </div>
      ) : (
        <div>
          {/* Top Header Section */}
          <div className="primaryBgColor text-white">
            <div className="flex gap-6 xl:container xl:mx-auto p-3 justify-center md:justify-start">
              <h1 className="md:border-r-1 px-4">
                Welcome to {GeneralInfoList?.CompanyName}
              </h1>
              <div className="items-center gap-2 border-r-1 px-4 hidden md:flex">
                <TfiTruck />
                <p>Track Your Order</p>
              </div>
              <div className="items-center gap-2 hidden md:flex">
                <MdEmail className="text-2xl" />
                {GeneralInfoList?.CompanyEmail.map((email, index) => (
                  <a key={index} href={`mailto:${email}`} className="mr-2">
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Header Section */}
          <div className="justify-between  border-b border-gray-200 md:px-3">
            <div
              className={
                "xl:container xl:mx-auto py-3 px-3 flex gap-6 items-center justify-between"
              }
            >
              {/* Hamburger Menu on the left */}
              <div ref={hamburgerRef} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <GiHamburgerMenu className="text-2xl cursor-pointer lg:hidden" />
              </div>


              {/* Logo in the center */}
              <Link to="/">
                <ImageComponent
                  imageName={GeneralInfoList?.PrimaryLogo}
                  className="w-30"
                />
              </Link>
              <div className="flex-1 max-w-2xl hidden lg:flex">
                <input
                  type="text"
                  placeholder="Keyword here..."
                  className="px-3 py-2 w-full outline-none text-gray-700 border border-gray-200 rounded-l"
                />
                <button className="primaryBgColor p-3 rounded-r">
                  <CiSearch className="text-white w-5 h-5" />
                </button>
              </div>

              {/* Cart Menu on the right */}
              <div className="flex items-center justify-center gap-2 relative">
                <div className="transition-opacity duration-500 ease-in-out">
                  {user ? (
                    <Link to="/user/home">
                      <div className="flex items-center gap-2 flex-col opacity-100">
                        <IoPersonOutline className="w-6 h-6" />
                        <span className="text-sm hidden lg:block">
                          My Account
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <div className="flex items-center gap-2 flex-col opacity-100">
                        <IoPersonOutline className="w-6 h-6" />
                        <span className="text-sm hidden lg:block">
                          Login / Register
                        </span>
                      </div>
                    </Link>
                  )}
                </div>

                <div className="hidden lg:flex items-center gap-2 flex-col">
                  <AiOutlineHeart className="w-6 h-6" />
                  <span className="text-sm ">Wish List</span>
                </div>
                <div>
                  <div>
                    <div ref={cartButtonRef} onClick={() => setIsCartMenuOpen(!isCartMenuOpen)}>
                      <CiShoppingCart className="w-7 h-7 cursor-pointer" />
                    </div>

                    {/*Showing Cart Quantity*/}
                    <span className="absolute -top-2 -right-3 lg:right-1 primaryBgColor rounded-full h-6 w-6 p-2 flex items-center justify-center text-xs text-white">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </div>
                  <span className="text-sm hidden lg:block pt-1">My Cart</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay for Hamburger Menu */}
          <div
            className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
              isMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Overlay */}
            <div
              className="absolute inset-0 bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <div
              ref={menuRef}
              className="relative bg-white w-64 h-full shadow-lg transform transition-transform duration-400 ease-in-out"
              style={{
                transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <Link to="/">
                    <ImageComponent
                      imageName={GeneralInfoList?.PrimaryLogo}
                      className="w-30"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="cursor-pointer"
                  >
                    <MdClose className="text-3xl" />
                  </button>
                </div>
                <div className="space-y-2">
                  <MobileMenu />
                </div>
                <div className="transition-opacity duration-500 ease-in-out">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className={
                        "primaryBgColor accentTextColor px-4 py-2 rounded-lg w-full cursor-pointer"
                      }
                    >
                      Log Out
                    </button>
                  ) : (
                    <Link to="/login">
                      <div className="gap-3 inline-flex items-center justify-between mt-4">
                        <IoPersonOutline className="w-10 h-10 primaryBgColor rounded-full flex items-center justify-center text-xs text-white p-2" />
                        <span className="text-sm">Login / Register</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Cart Menu */}
          <div
            className={`fixed inset-0 z-50 lg:block transition-opacity duration-300 ${
              isCartMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-opacity-50"
              onClick={() => setIsCartMenuOpen(false)}
            />

            <div
              className="relative bg-white w-80 h-full shadow-lg transform transition-transform duration-400 ease-in-out overflow-y-auto"
              style={{
                transform: isCartMenuOpen
                  ? "translateX(0)"
                  : "translateX(100%)",
                position: "fixed",
                top: 0,
                right: 0,
                width: "350px", // Adjust the width of the menu
                height: "100vh", // Ensure the menu takes the full height of the viewport
                transition: "transform 0.3s ease-in-out", // Smooth transition for sliding in/out
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between gap-5 text-lg">
                    <h1>Your Cart</h1>
                    <h1>
                      {totalQuantity} {totalQuantity <= 1 ? "item" : "items"}
                    </h1>
                  </div>

                  <button
                    onClick={() => setIsCartMenuOpen(!isCartMenuOpen)}
                    className="cursor-pointer"
                  >
                    <MdClose className="text-2xl" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Cart onCloseCartMenu={handleCloseCartMenu} />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Bar (Desktop Only) */}
          <div className={"hidden lg:block"}>
            <MenuBar />
          </div>
        </div>
      )}
    </div>
  );
};

export default Headers;
