import Counter from "../components/Counter";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
    

      {children}
    </div>
  );
}
