import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
  HiOutlineCreditCard,
  HiOutlineReceiptPercent,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiOutlineTv,
  HiOutlineGift,
} from "react-icons/hi2";

const features = [
  {
    title: "Top Up",
    icon: HiOutlineCreditCard,
  },
  {
    title: "Tagihan",
    icon: HiOutlineReceiptPercent,
  },
  {
    title: "Laptop",
    icon: HiOutlineComputerDesktop,
  },
  {
    title: "Gadget",
    icon: HiOutlineDevicePhoneMobile,
  },
  {
    title: "Fashion",
    icon: HiOutlineShoppingBag,
  },
  {
    title: "Elektronik",
    icon: HiOutlineTv,
  },
  {
    title: "Rumah",
    icon: HiOutlineHome,
  },
  {
    title: "Lainnya",
    icon: HiOutlineGift,
  },
];

export default function FeatureSlider() {
  return (
    <div className="px-4 py-4">
      <Swiper
        slidesPerView={4.2}
        spaceBetween={15}
      >
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Icon className="text-3xl text-blue-600" />
                </div>

                <p className="text-sm mt-2 text-center">
                  {item.title}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
