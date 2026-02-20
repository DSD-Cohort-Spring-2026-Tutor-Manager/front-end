import './DataboxMed.css';

function DataboxMed() {
  return (
    <div
      className='databox-med
    '
    >
      <h2 className='databox__title'>
        Your student has{' '}
        <span className='text-lime-600 font-bold'>improved</span> since last
        exam
      </h2>
      <p className='databox__title-value'>
        <span className='text-orange-400'>64 </span>
        <span className='text-blue-950'>&#10141;</span>{' '}
        <span className='text-green-800'>85</span>
      </p>
      <button className='databox__btn'>View</button>
      {/* <Link className='databox__btn' href={href}>
        {cta}
      </Link> */}
    </div>
  );
}

export default DataboxMed;
