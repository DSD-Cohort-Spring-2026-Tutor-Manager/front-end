'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import './SideNav.css';

const navItems = [
  { href: '/', label: 'Home', icon: '/icons/home.svg' },
  { href: '/class', label: 'Class', icon: '/icons/tutor.svg' },
  { href: '/student', label: 'Student', icon: '/icons/student.svg' },
  { href: '/shop', label: 'Shop', icon: '/icons/shop.svg' },
];

function SideNav() {
  const pathname = usePathname();

  return (
    <aside className='side-nav bg-(--Support)'>
      <nav className='side-nav__container'>
        <div className='side-nav__logo-container'>
          <img src='/icons/logo.svg' alt='Tutortoise logo' />
        </div>
        <ul className='side-nav__list'>
          {navItems.map((item) => {
            return (
              <li key={item.href}>
                <Link className='side-nav__item' href={item.href}>
                  <img
                    className='side-nav__icon-img'
                    src={item.icon}
                    alt={item.label}
                  />
                  <span className='side-nav__icon-label'>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className='side-nav__logout'>
          <img
            className='side-nav__icon-img'
            src='/icons/logout.svg'
            alt='logout icon'
          />
          <span className='side-nav__icon-label'>Logout</span>
        </div>
      </nav>
    </aside>
  );
}

export default SideNav;
