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
  dropdownContent,
  dropdownOnChange
}: {
  title: string;
  value: string;
  cta: string;
  href: string;
  topRightIcon?: TopRightIcon;
  dropdownContent?: any[];
  dropdownOnChange?: (selectedOption: any) => void;
}) {


  return (
    <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl relative'>
      <h2 className='databox__title'>{title}</h2>
      <p className='databox__title-value'>{value}</p>
      {
        dropdownContent?.length ? (
          <div className="dropdown databox_btn">
            <button className="dropbtn">Switch</button>
            <div className="dropdown-content">
              {dropdownContent.map((e, index) => (
                <a
                  key={`option-${index}`}
                  onClick={() => dropdownOnChange(e)}
                >
                  {e.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <Link className='databox__btn' href={href}>
            {cta}
          </Link>
        )
      }
      
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
