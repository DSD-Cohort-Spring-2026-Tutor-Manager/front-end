import React from 'react'
import './TopNav.css';

const TopNav = ({name, avatarIconSrc}: { name: string, avatarIconSrc: string }) => {
  return (
    <header className='topnav'>
        <div className="topnav__container">
            <img className="topnav-logo" src='/icons/tutortoise-logo.svg' />

            <div className="topnav__user-container">
                <img className="topnav-notification" src="/icons/notification.svg" />
                <img className="topnav-avatar" src={avatarIconSrc} />
                <h3 className='topnav-username'>
                    {name}
                </h3>
            </div>
        </div>
    </header>
  )
}

export default TopNav
