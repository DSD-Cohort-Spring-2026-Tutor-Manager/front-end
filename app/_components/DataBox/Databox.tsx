import Link from 'next/link';

function Databox({
  title,
  value,
  cta,
  href,
}: {
  title: string;
  value: string;
  cta: string;
  href: string;
}) {
  return (
    <div className='databox-sm w-full h-80 bg-(--Primary) rounded-xl'>
      <h2 className='databox__title'>{title}</h2>
      <p className='databox__title-value'>{value}</p>
      <Link className='databox__btn' href={href}>
        {cta}
      </Link>
    </div>
  );
}

export default Databox;
