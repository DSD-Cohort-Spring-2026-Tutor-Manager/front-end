import './DataboxMed.css';

type Session = {
  datetimeStarted: string;
  assessmentPointsEarned: number;
  sessionStatus: string;
};

type DataboxMedProps = {
  latest: Session[];
};

function DataboxMed({ latest }: DataboxMedProps) {
  const current = latest[0]?.assessmentPointsEarned ?? 0;
  const previous = latest[1]?.assessmentPointsEarned ?? 0;

  return (
    <div
      className='databox-med
    '
    >
      <h2 className='databox__title'>
        Student's grade{' '}
        <span className='text-lime-600 font-bold'>increased</span> since last
        exam
      </h2>
      <p className='databox__title-value'>
        <span className='text-orange-400'>{previous} </span>
        <span className='text-blue-950'>&#10141;</span>{' '}
        <span className='text-green-800'>{current}</span>
      </p>
      <button className='databox__btn'>View</button>
      {/* <Link className='databox__btn' href={href}>
        {cta}
      </Link> */}
    </div>
  );
}

export default DataboxMed;
