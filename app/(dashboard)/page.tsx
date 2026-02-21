'use client';
import { useContext, useEffect, useState } from 'react';
import { CreditContext } from '@/app/_components/CreditContext/CreditContext';
import Databox from '../_components/DataBox/Databox';
import DataboxMed from '../_components/DataBox/DataboxMed';
import CreditsViewBar from '../_components/CreditsViewbar/CreditsViewBar';
import './dashboard.css';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import Modal from '../_components/Modal/Modal';
function Home() {
  const [isAddStudentModalOpen, setAddStudentModalIsOpen] = useState(false);
  const ctx = useContext(CreditContext);
  if (!ctx)
    throw new Error('CreditContext is missing. Wrap app in CreditProvider.');

  const { credits, addCredits } = ctx;

  const addStudent = () => {
    const firstName = (document.getElementById('firstName') as any)?.value;
    const lastName = (document.getElementById('lastName') as any)?.value;

    if (!firstName || !lastName) {
      return;
    }
    TutortoiseClient.addStudent(1, firstName, lastName)
    .catch((err) => {
     console.error(err); 
    })
    .finally(() => {
      setAddStudentModalIsOpen(false);
    })
  }

  useEffect(() => {
    TutortoiseClient.getBalance('1').then((res: number) => {
      addCredits(-credits + res);
    });
  }, []);


  return (
    <main className='dashboard'>
      <CreditsViewBar
        value={credits.toString()}
        href='/credits'
        cta='Need more credits?'
      />
      <section className='dashboard__data-row'>
        <Databox
          title='Student'
          value='Zayn'
          href='/student'
          cta='switch'
          topRightIcon={{
            src: '/icons/Add user icon.svg',
            alt: 'Add student button',
            onClick: () => setAddStudentModalIsOpen(true),
          }}
        />
        <Databox
          title='Sessions completed'
          value='3'
          href='/student'
          cta='View'
        />
        <DataboxMed />
        {isAddStudentModalOpen && <Modal
          type='add student'
          text=''
          buttons={[
            {
              className: 'add-student-confirm-button',
              text: 'Add Student',
              onClick: () => addStudent()
            },
            {
              className: 'add-student-cancel-button',
              text: 'Cancel',
              onClick: () => setAddStudentModalIsOpen(false)
            }
          ]}
        />}
      </section>
    </main>
  );
}

export default Home;
