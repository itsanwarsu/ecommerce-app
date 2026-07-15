import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
  HiOutlineCreditCard,
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
    title: "Laptop",
    icon: HiOutlineComputerDesktop,
  },
  {
    title: "Gadget",
    icon: HiOutlineDevicePhoneMobile,
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
    <div className="px-2 py-2 mt-1">
      <Swiper
        slidesPerView={4.2}
        spaceBetween={10}
      >
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full">
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
