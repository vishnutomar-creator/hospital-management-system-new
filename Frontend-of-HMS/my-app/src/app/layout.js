import "./globals.css";
import { ThemeProvider } from "../app/context/ThemeContext";
import { AuthProvider } from "../app/context/AuthContext";
import { NotificationProvider } from "../app/context/NotificationContext";
import { RoleProvider } from "../app/context/RoleContext";

export const metadata = {
  title: {
    default: "MediCare HMS",
    template: "%s — MediCare HMS",
  },
  description: "A comprehensive Hospital Management System for managing patients, doctors, admissions, billing, and more.",
  keywords: ["hospital", "HMS", "medical", "patients", "doctors", "healthcare"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Anti-FOUC: apply saved dark class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hms_theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <ThemeProvider>
          <AuthProvider>
            <RoleProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}