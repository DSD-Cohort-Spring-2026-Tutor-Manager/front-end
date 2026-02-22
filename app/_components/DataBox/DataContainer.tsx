import Image from "next/image";

type TopRightIcon = {
  src: string;
  alt: string;
  onClick?: () => void;
};

function DataContainer({
  title,
  value,
  topRightIcon,
}: {
  title: string;
  value: string;
  topRightIcon?: TopRightIcon;
}) {
  return (
    <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
      <h2 className="databox__title">{title}</h2>
      <p className="databox__title-value">{value}</p>
      {topRightIcon && (
        <Image
          className="databox__tr-image"
          src={topRightIcon.src}
          alt={topRightIcon.alt}
        />
      )}
    </div>
  );
}

export default DataContainer;
