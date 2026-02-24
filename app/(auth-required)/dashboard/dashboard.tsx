"use client";

import { useEffect, useState } from "react";

import { assetService, Asset } from "@/services/models/assets.service";
import { employeeService, Employee } from "@/services/models/employee.service";

import { InfoCards } from "@/components/dashboard/infoCards";

export function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(assets);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assetsData, employeesData] = await Promise.all([
          assetService.getAll(),
          employeeService.getAll(),
        ]);
        const assetsArray = Array.isArray(assetsData)
          ? assetsData
          : assetsData?.results || [];
        const employeesArray = Array.isArray(employeesData)
          ? employeesData
          : employeesData?.results || [];
        setAssets(assetsArray);
        setEmployees(employeesArray);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setAssets([]);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const total_ativos = assets.length;
  const total_funcionarios = employees.length;

  const CardProps = [
    {
      title: "Total de Ativos",
      value: total_ativos,
      icon: <div className="w-6 h-6 rounded-full"></div>,
      className: "bg-blue-500",
      router: "/ativos",
    },
    {
      title: "Ativos em Uso",
      value: assets.filter((asset) => asset.status === "IN_USE").length,
      icon: <div className="w-6 h-6 rounded-full"></div>,
      className: "bg-purple-500",
      router: "/ativos",
    },
    {
      title: "Ativos em Manutenção",
      value: assets.filter((asset) => asset.status === "MAINTENANCE").length,
      icon: <div className="w-6 h-6 rounded-full"></div>,
      className: "bg-yellow-500",
      router: "/ativos",
    },
    {
      title: "Total de Funcionarios",
      value: total_funcionarios,
      icon: <div className="w-6 h-6 rounded-full"></div>,
      className: "bg-green-500",
      router: "/funcionarios",
    },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="flex flex-col h-full w-full gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CardProps.map((item, index) => (
            <InfoCards key={index} {...item} />
          ))}
        </div>
        <div className="w-full min-h-0 rounded-lg p-6 shadow-sm">
          <h1 className="text-lg font-semibold mb-4">Ativos Recentes</h1>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">ATIVO</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    RESPONSÁVEL
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 5).map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{asset.id}</td>
                    <td className="py-3 px-4">{asset.name}</td>
                    <td className="py-3 px-4">
                      {asset.person_in_charge?.name || "Não atribuído"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          asset.status === "IN_USE"
                            ? "bg-green-100 text-green-700"
                            : asset.status === "MAINTENANCE"
                              ? "bg-yellow-100 text-yellow-700"
                              : asset.status === "UNAVAILABLE"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {asset.status === "IN_USE"
                          ? "Ativo"
                          : asset.status === "MAINTENANCE"
                            ? "Manutenção"
                            : asset.status === "UNAVAILABLE"
                              ? "Desativado"
                              : asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
