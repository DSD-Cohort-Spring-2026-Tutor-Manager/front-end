'use client';

import Modal from '../../_components/Modal/Modal';
import './credits.css';
import CreditOpts from '../../_components/CreditOpts/CreditOpts';
import { useRouter } from 'next/navigation';
import { useState, useContext } from 'react';

import { ParentContext } from '../../context/ParentContext';
import { TutortoiseClient } from '../../_api/tutortoiseClient';

function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [currentBtn, setCurrentBtn] = useState<boolean>(false);

  const onPurchase = (payload: { credits: number }) => {
    setPendingAmount(payload.credits);
  };

  const modalDetails = {
    text: `Purchase ${pendingAmount} credits?`,
    buttons: [
      {
        text: 'Confirm',
        onClick: () => {
          TutortoiseClient.buyCredits('1', pendingAmount, 15)
            .then((res: number) => {
              addCredits(pendingAmount);
            })
            .finally(() => {
              setIsOpen(false);
              // router.push('/'); // Redirect to home
            });
        },
      },
      { text: 'Cancel', onClick: () => setIsOpen(false) },
    ],
  };

  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error('ParentContext is missing. Wrap app in ParentProvider.');

  const { parentDetails, addCredits } = parentCtx; // Destructure addCredits from ParentContext
  const { creditBalance } = parentDetails; // Extract creditBalance from ParentContext

  return (
    <div className='credits'>
      <header className='credits__header'>
        <h1 className='credits__header-title'>Credits</h1>
        <p className='credits__header-subtext'>
          You have {creditBalance} credits available.<br></br> 1 credit equals an hour
          of tutoring for your child.
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
      <CreditOpts
        currentCredit={creditBalance}
        isModalOpen={isOpen}
        modalDetails={modalDetails}
        onSelectOption={onPurchase}
      />

      <button
        className='credits__purchase-btn'
        onClick={() => {
          if (pendingAmount > 0) setIsOpen(true);
        }}
      >
        Purchase Credits
      </button>

      {isOpen && (
        <Modal text={modalDetails.text} buttons={modalDetails.buttons ?? []} />
      )}
    </div>
  );
}

export default Page;
