import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { convertImageFilePathToName } from "../util/converter";
import { motion, AnimatePresence } from "framer-motion";

export default function ImagePickerSlider({ images, selectedImage, onSelect }) {
  const currentIndex = images.findIndex(
    (img) => convertImageFilePathToName(img.url) === selectedImage
  );
  const idx = currentIndex >= 0 ? currentIndex : 0;
  const { url, caption } = images[idx];

  const prev = () => {
    const prevIdx = (idx - 1 + images.length) % images.length;
    onSelect(convertImageFilePathToName(images[prevIdx].url));
  };
  const next = () => {
    const nextIdx = (idx + 1) % images.length;
    onSelect(convertImageFilePathToName(images[nextIdx].url));
  };

  return (
    <div id="image-slider">
      <button className="arrow left" onClick={prev} aria-label="Previous">
        <FiChevronLeft size={24} />
      </button>

      <div className="slide-container">
        <AnimatePresence initial={false}>
          <motion.img
            key={url}
            src={url}
            alt={caption}
            className="slide-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>

      <button className="arrow right" onClick={next} aria-label="Next">
        <FiChevronRight size={24} />
      </button>
    </div>
  );
}
