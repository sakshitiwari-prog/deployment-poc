import Counter from "../components/Counter";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2>Dashboard Template</h2>

      <Counter />

      <hr />

      {children}
    </div>
  );
}
