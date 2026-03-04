// app/admin/layout.tsx
import SideNav from "../_components/SideNav/SideNav";
import TopNavWrapper from "../_components/TopNav/TopNavWrapper";
import CreditProvider from "../_components/CreditContext/CreditProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideNav />
      <div className="shell__body">
        <TopNavWrapper />
        <div className="shell__content">
          <CreditProvider>{children}</CreditProvider>
        </div>
      </div>
    </>
  );
}
