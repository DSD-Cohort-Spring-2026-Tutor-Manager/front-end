// app/dashboard/layout.tsx
import SideNav from '../_components/SideNav/SideNav';
import TopNavWrapper from '../_components/TopNav/TopNavWrapper';
import CreditProvider from '../_components/CreditContext/CreditProvider';
import { ParentProvider } from '../context/ParentContext';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideNav />
      <div className='shell__body'>
        <TopNavWrapper />
        <div className='shell__content'>
          <CreditProvider>
            <ParentProvider>{children}</ParentProvider>
          </CreditProvider>
        </div>
      </div>
    </>
  );
}
