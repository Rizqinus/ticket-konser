
import "./globals.css";

export const metadata = {
  title: "Concert Manager | Admin",
  description: "Enterprise Administration Portal - Concert Manager",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface selection:bg-primary-fixed">
        {children}
      </body>
    </html>
  );
}
