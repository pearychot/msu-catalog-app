import './globals.css';
import './header.css';
import './chat.css';
import './mockup.css';

export const metadata = {
  title: 'M.S. Union Catalog',
  description: 'Browse our cosmetic packaging catalog',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
