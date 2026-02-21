import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

// export const metadata: Metadata = {
//   title: 'Tutortoise',
//   description:
//     'Tutortoise is a learning center management platform designed to help parents see the value of tutoring by tracking student performance and prevent revenue loss for learning centers through automatic credit-deduction for sessions and transaction observability.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
