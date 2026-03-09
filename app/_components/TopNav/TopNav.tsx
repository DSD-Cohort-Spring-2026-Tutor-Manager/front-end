import React from 'react';
import './TopNav.css';

const ROLE_LABELS: Record<string, string> = {
  parent: 'Parent',
  tutor: 'Tutor',
  admin: 'Admin',
};

const TopNav = ({
  name,
  avatarIconSrc,
  role,
}: {
  name: string;
  avatarIconSrc: string;
  role?: string;
}) => {
  return (
    <header className='topnav'>
      <div className='topnav__container'>
        {/* Horizontal logo */}
        <img
          className='topnav-logo'
          src='/icons/Tutortoise-horiz-logo.svg'
          alt='Tutortoise'
        />

        <div className='topnav__user-container'>
          {/* Notification */}
          <button
            type='button'
            className='topnav-notification'
            aria-label='Open notifications'
          >
            <img
              src='/icons/notification.svg'
              className='max-w-none'
              alt=''
              aria-hidden='true'
              width={26}
              height={26}
              max-width={26}
              max-height={26}
            />
          </button>

          {/* Role badge */}
          {role && (
            <span className='topnav-role-badge'>
              {ROLE_LABELS[role] ?? role}
            </span>
          )}

          {/* Avatar */}
          <img
            className='topnav-avatar'
            src={avatarIconSrc}
            alt={`${name} avatar`}
          />

          {/* Username */}
          <h3 className='topnav-username'>{name}</h3>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
