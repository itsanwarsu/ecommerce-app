// src/data/products.js

const products = [
  {
    _id: 1,
    name: "ASUS ROG Strix G16",
    price: 25000000,
    images: ["/asusrogdepan.jpg","/asusrogstrixbelakang.jpg"],
    category: "Laptop",
    description:
      "ASUS ROG Strix G16 adalah laptop gaming berperforma tinggi dengan prosesor powerful, GPU dedicated, layar refresh rate tinggi, dan sistem pendingin optimal untuk gaming, editing, serta multitasking berat.",
    stock: 10,
    rating: 4.8
  },

  {
    _id: 2,
    name: "iPhone 16 Pro",
    price: 18000000,
    images: ["/iphone16.jpg","/iphone16depan.webp"],
    category: "Gadget",
    description:
      "Smartphone premium dengan kamera canggih, performa tinggi, dan desain elegan untuk kebutuhan harian maupun profesional.",
    stock: 5,
    rating: 4.9
  }
];

export default products;
