import './credits.css';
import CreditOpts from '@/app/_components/CreditOpts/CreditOpts';
function page() {
  return (
    <div className='credits'>
      <header className='credits__header'>
        <h1 className='credits__header-title'>Credits</h1>
        <p className='credits__header-subtext'>
          You have 3 credits available.<br></br> 1 credit equals an hour of
          tutoring for your child.
        </p>
      </header>
      <section className='billing'>
        <h2 className='billing__title'>Billing information</h2>
        <div className='billing__card'>
          <div className='billing__card-info'>
            <p>
              Card nickname: <span>turtle debit</span>
            </p>
            <p>
              Ending in: <span>xxxx-xxxx-xxxx-5432</span>
            </p>
          </div>
          <div className='billing__card-btn'>Edit</div>
        </div>
      </section>
      <CreditOpts />
    </div>
  );
}

export default page;
