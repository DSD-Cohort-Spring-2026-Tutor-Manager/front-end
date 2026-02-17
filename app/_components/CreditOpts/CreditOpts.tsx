'use client';

import { useMemo, useState } from 'react';
import './CreditOpts.css';
import Modal from '@/app/_components/Modal/Modal';

type CreditOption = {
  id: string;
  label: string;
  credits: number;
  price: number;
};

const OPTIONS: CreditOption[] = [
  { id: '1', label: '1 Credit', credits: 1, price: 50 },
  { id: '3', label: '3 Credits', credits: 3, price: 145 },
  { id: '5', label: '5 Credits', credits: 5, price: 240 },
  { id: '7', label: '7 Credit', credits: 7, price: 330 },
];

const formatUSD = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

type ModalDetails = {
  text: string;
  buttons?: { text: string; onClick: () => void }[];
};

type CreditOptsProps = {
  onSelectOption?: (payload: {
    credits: number;
    price: number;
    id: string;
  }) => void;

  isModalOpen?: boolean;
  modalDetails?: ModalDetails;
  currentCredit: number;
};

function CreditOpts({
  onSelectOption,
  isModalOpen = true,
  modalDetails,
  currentCredit,
}: CreditOptsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => OPTIONS.find((o) => o.id === selectedId) ?? null,
    [selectedId],
  );

  const total = selected?.price ?? 0;

  const handlePick = (option: CreditOption) => {
    setSelectedId(option.id);
    onSelectOption?.({
      id: option.id,
      credits: option.credits,
      price: option.price,
    });
  };

  return (
    <section className='credit-opts'>
      <h2 className='credit-opts__title'>Credit options</h2>

      <div className='credit-opts__grid'>
        {OPTIONS.map((opt) => {
          const active = opt.id === selectedId;

          return (
            <div key={opt.id} className='credit-opts__rows-container'>
              <button
                type='button'
                className={`credit-opts__row ${active ? 'credit-opts__row--active' : ''}`}
                onClick={() => handlePick(opt)}
              >
                <span className='credit-opts__pill'>{opt.label}</span>
              </button>
              <span className='credit-opts__price'>{formatUSD(opt.price)}</span>
            </div>
          );
        })}
      </div>

      <div className='credit-opts__total'>
        <span className='credit-opts__total-label'>Total:</span>
        <span className='credit-opts__total-value'>{formatUSD(total)}</span>
      </div>
      {/* {isModalOpen && modalDetails ? (
        <Modal text={modalDetails.text} buttons={modalDetails.buttons ?? []} />
      ) : null} */}
    </section>
  );
}

export default CreditOpts;
