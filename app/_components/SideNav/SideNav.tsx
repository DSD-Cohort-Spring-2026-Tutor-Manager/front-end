'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import './SideNav.css';

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: '/icons/home.svg',
    iconActive: '/icons/Home-act.svg',
  },
  { href: '/class', label: 'Classes', icon: '/icons/tutor.svg' },
  { href: '/student', label: 'Student', icon: '/icons/student.svg' },
  {
    href: '/credits',
    label: 'Credits',
    icon: '/icons/shop.svg',
    iconActive: '/icons/Shop-act.svg',
  },
];

function SideNav() {
  const pathname = usePathname();

  return (
    <aside className='side-nav bg-(--Support)'>
      <nav className='side-nav__container'>
        <div className='side-nav__logo-container'>
          <img
            className='side-nav__logo'
            src='/icons/tutortoise-logo.svg'
            alt='Tutortoise logo'
          />
        </div>
        <ul className='side-nav__list'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link className='side-nav__item' href={item.href}>
                  <img
                    className='side-nav__icon-img'
                    src={isActive ? item.iconActive : item.icon}
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
