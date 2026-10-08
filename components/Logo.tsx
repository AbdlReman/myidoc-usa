import Image from "next/image";

type Props = { light?: boolean };

export default function Logo({ light = false }: Props) {
  return (
    <span className={`logo ${light ? "logo--light" : ""}`}>
      <Image
        src={light ? "/images/logo_dark.png" : "/images/MYiDocUSA_logo_hd.png"}
        alt="MYiDocUSA"
        width={219}
        height={64}
        className="logo__img"
        priority
      />
    </span>
  );
}
