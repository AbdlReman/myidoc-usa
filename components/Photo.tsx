import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  placeholder: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fit?: "cover" | "contain";
};

/** Shows the real photo when `src` is set, otherwise a labelled placeholder. */
export default function Photo({ src, alt, placeholder, className = "", priority, sizes = "(max-width: 768px) 100vw, 50vw", fit = "cover" }: Props) {
  return (
    <div className={`photo ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: fit }} />
      ) : (
        <span className="photo__placeholder">{placeholder}</span>
      )}
    </div>
  );
}
