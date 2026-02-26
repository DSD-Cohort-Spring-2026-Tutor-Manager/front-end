import Link from 'next/link';
import './Databox.css';

type TopRightIcon = {
  src: string;
  alt: string;
  onClick?: () => void;
};

function Databox({
  title,
  value,
  cta,
  href,
  topRightIcon,
}: {
  title: string;
  value: string;
  cta: string;
  href: string;
  topRightIcon?: TopRightIcon;
}) {
  return (
    <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl relative'>
      <h2 className='databox__title'>{title}</h2>
      <p className='databox__title-value'>{value}</p>
      <Link className='databox__btn' href={href}>
        {cta}
      </Link>
      {topRightIcon && (
        <img
          className='databox__tr-image'
          src={topRightIcon.src}
          alt={topRightIcon.alt}
          onClick={() => topRightIcon.onClick?.()}
        />
      )}
    </div>
  );
}

export default Databox;
