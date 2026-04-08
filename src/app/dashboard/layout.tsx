// Dashboard has its own full-screen sidebar layout — no public Navbar/Footer/Chatbot
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
