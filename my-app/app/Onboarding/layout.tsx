import Link from "next/link";
import Counter from "../components/Counter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Dashboard Layout</h1>

      <nav>
        <Link href="/Onboarding">Dashboard</Link>{" "}
        <Link href="/Onboarding/Profile">Profile</Link>{" "}
      </nav>

      <hr />

      <Counter />

      <hr />

      {children}
    </div>
  );
}
