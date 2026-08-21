import type { ProjectImage } from "@/content/site";

export function ImageGallery({ images }: { images: ProjectImage[] }) {
  return (
    <div className="gallery">
      {images.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          {image.caption ? <figcaption>{image.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}
