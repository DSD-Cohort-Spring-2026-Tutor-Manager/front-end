import Link from 'next/link';
import './Databox.css';

type TopRightIcon = {
  src: string;
  alt: string;
  onClick?: () => void;
};

function Databox({
  title,
  subtitle,
  value,
  cta,
  href,
  onClick,
  topRightIcon,
  dropdownContent,
  dropdownOnChange,
}: {
  title: string;
  subtitle?: string;
  value: string | number;
  cta?: string;
  href?: string;
  onClick?: () => void;
  topRightIcon?: TopRightIcon;
  dropdownContent?: any[];
  dropdownOnChange?: (selectedOption: any) => void;
}) {
  return (
    <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl relative'>
      <h2 className='databox__title'>{title}</h2>

      <p className='databox__title-value'>{value}</p>
      {subtitle ? <h3 className='databox__subtitle'>{subtitle}</h3> : ''}
      {cta &&
        (dropdownContent?.length ? (
          <div className='dropdown databox_btn'>
            <button className='dropbtn'>Switch</button>
            <div className='dropdown-content'>
              {dropdownContent.map((e, index) => (
                <a
                  key={`option-${index}`}
                  onClick={() => dropdownOnChange?.(e)}
                >
                  {e.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <Link className='databox__btn' href={href ?? '#'} onClick={onClick}>
            {cta}
          </Link>
        ))}

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
