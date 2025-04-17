import { useEffect, useState } from "react";

const allImages = [
  "/images/File 1.jpeg",
  "/images/File 2.jpeg",
  "/images/File 3.jpeg",
  "/images/File 4.jpeg",
  "/images/File 5.jpeg",
  "/images/File 6.jpeg",
  "/images/File 7.jpeg",
  "/images/File 8.jpeg",
  "/images/File 9.jpeg",
  "/images/File 10.jpeg",
];

const getRandomImages = () =>
  Array.from({ length: 9 }, () => {
    const index = Math.floor(Math.random() * allImages.length);
    return allImages[index];
  });

const AuthImagePatt = ({ title, subtitle }) => {
  const [images, setImages] = useState(getRandomImages());

  useEffect(() => {
    const interval = setInterval(() => {
      setImages(getRandomImages());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-gray-400 to-gray-1 text-white p-12 relative w-full h-screen overflow-hidden">
      
      {/* Title Section */}
      <div className="mb-10 text-center z-10">
        <h2 className="text-4xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-300 text-lg max-w-lg">{subtitle}</p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 z-10">
        {images.map((img, i) => (
          <div
            key={i}
            className="w-28 h-28 rounded-xl overflow-hidden shadow-md border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <img
              src={img}
              alt={`icon-${i}`}
              className="w-full h-full object-cover transition duration-500 ease-in-out"
            />
          </div>
        ))}
      </div>

      {/* Background Effects (Subtle Gray Blobs) */}
      <div className="absolute w-80 h-80 bg-gray-600 rounded-full blur-3xl opacity-20 top-10 left-10" />
      <div className="absolute w-80 h-80 bg-gray-500 rounded-full blur-3xl opacity-10 bottom-10 right-10" />
    </div>
  );
};

export default AuthImagePatt;
