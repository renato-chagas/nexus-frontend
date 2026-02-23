"use client";

import { useEffect, useState } from "react";

import { assetService, Asset } from "@/services/models/assets.service";
import { employeeService, Employee } from "@/services/models/employee.service";

import { InfoCards } from "@/components/dashboard/infoCards";

export function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="h-full w-full ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CardProps.map((item, index) => (
            <InfoCards key={index} {...item} />
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Dashboard;
