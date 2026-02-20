import Link from 'next/link';
import './CreditsViewBar.css';

function CreditsViewBar({
  value,
  cta,
  href,
}: {
  value: string;
  cta: string;
  href: string;
}) {
  return (
    <div className='view-bar'>
      <p className='view-bar__text'>
        You own{' '}
        <span
          className={`view-bar__credits ${Number(value) >= 4 ? 'view-bar__credits_type_good' : 'view-bar__credits_type_low'}`}
        >
          {value}
        </span>{' '}
        credits
      </p>
      <Link className='view-bar__button' href={href}>
        {cta}
      </Link>
    </div>
  );
}

export default CreditsViewBar;
