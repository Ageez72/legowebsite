"use client";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import logo from "../../assets/imgs/logo.svg";
import Image from "next/image";

export default function Offcanvas({ isOffCanvas, handleOffCanvas, scroll }) {
  return (
    <>
      <div className="fix-area">
        <div
          className={`offcanvas__info p-4 ${
            isOffCanvas ? "active" : "not-active"
          }`}
        >
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 flex items-center justify-between">
                <div className="offcanvas__logo">
                <Link href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                <Image
                  className="logo-img"
                  src={logo}
                  alt="My Image"
                  width={166}
                  height={54}
                />
              </Link>
                </div>
                <div className="offcanvas__close" onClick={handleOffCanvas}>
                  <i className="icon-multiplication-sign"></i>
                </div>
              </div>
              <div className="">
                <MobileMenu onGoTo={handleOffCanvas} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay d-md-block d-lg-none ${
          isOffCanvas ? "overlay-open" : ""
        }`}
        onClick={handleOffCanvas}
      />
    </>
  );
}
