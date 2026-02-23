import Menu from "@/components/navigation/Menu";
import Header from "@/components/navigation/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      <div className="row-start-1 col-span-full">
        <Header />
      </div>
      <div className="row-start-2 grid grid-cols-[240px_1fr] h-full overflow-hidden">
        <div className="col-start-1 col-end-2 h-full overflow-y-auto">
          <Menu />
        </div>
        <main className="col-start-2 col-end-3 h-full w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
