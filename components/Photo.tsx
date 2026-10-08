import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  placeholder: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Shows the real photo when `src` is set, otherwise a labelled placeholder. */
export default function Photo({ src, alt, placeholder, className = "", priority, sizes = "(max-width: 768px) 100vw, 50vw" }: Props) {
  return (
    <div className={`photo ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: "cover" }} />
      ) : (
        <span className="photo__placeholder">{placeholder}</span>
      )}
    </div>
  );
}
