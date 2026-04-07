// Login page has its own dark full-screen layout — no Navbar, no Footer, no Chatbot
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
