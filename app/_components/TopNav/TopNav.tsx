import React from 'react'
import './TopNav.css';

const TopNav = () => {
  const name = 'Samantha Villanueva';
  return (
    <header className='topnav'>
        <div className="topnav__container">
            <img className="topnav-logo" src='/icons/tutortoise-logo.svg' />

            <div className="topnav__usercontainer">
                <img className="topnav-notification" src="/icons/notification.svg" />
                <img className="topnav-avatar" src="/images/worm_with_glasses.png" />
                <h3 className='topnav-username'>{name}</h3>
            </div>
        </div>
    </header>
  )
}

export default TopNav
