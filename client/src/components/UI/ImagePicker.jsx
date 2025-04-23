import { convertImageFilePathToName } from "../util/converter";

export default function ImagePicker({ images, selectedImage, onSelect }) {
  return (
    <div id="image-picker">
      <p>Select an image</p>
      <ul>
        {images.map((image) => {
          const filename = convertImageFilePathToName(image.url);
          return (
            <li
              key={filename}
              onClick={() => onSelect(filename)}
              className={selectedImage === filename ? "selected" : undefined}
            >
              <img src={image.url} alt={image.caption} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
