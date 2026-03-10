import './DataboxMed.css';

type Session = {
  datetimeStarted: string;
  assessmentPointsEarned: number;
  sessionStatus: string;
};

type DataboxMedProps = {
  latest: Session[];
  subjectFilter: string;
  changeSubject: (direction: 'previous' | 'next') => void;
};

function DataboxMed({ latest, subjectFilter, changeSubject }: DataboxMedProps) {
  const current = latest[0]?.assessmentPointsEarned ?? 0;
  const previous = latest[1]?.assessmentPointsEarned ?? 0;
  const gradeChangeWord =
    previous > current
      ? 'decreased'
      : previous < current
        ? 'increased'
        : "didn't change";
  const gradeColor = () => {
    if (previous > current) return 'text-orange-400';
    if (previous < current) return 'text-green-800';
    return 'text-blue-950';
  };
  return (
    <div
      className='databox-med
    '
    >
      <h2 className='databox__title'>
        Student's grade <span className={gradeColor()}>{gradeChangeWord}</span>{' '}
        since last exam
      </h2>
      <p className='databox__title-value'>
        <span className={gradeColor()}>{previous} </span>
        <span className='text-blue-950'>&#10141;</span>{' '}
        <span className={gradeColor()}>{current}</span>
      </p>
      <h3 className='databox__subtitle'>in {subjectFilter}</h3>
      <div className='databox__buttons-container'>
        <button
          onClick={() => changeSubject('previous')}
          className='databox__btn'
        >
          Prev
        </button>
        <button onClick={() => changeSubject('next')} className='databox__btn'>
          Next
        </button>
      </div>
    </div>
  );
}

export default DataboxMed;
