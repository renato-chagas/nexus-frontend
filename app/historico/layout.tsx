import Menu from "@/components/global/menu";
import Header from "@/components/global/header";

export default function HistoricoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <div className="row-start-1 col-span-full">
        <Header />
      </div>
      <div className="row-start-2 grid grid-cols-[240px_1fr] h-full">
        <div className="col-start-1 col-end-2 h-full">
          <Menu />
        </div>
        <main className="col-start-2 col-end-3 h-full w-full">{children}</main>
      </div>
    </div>
  );
}
