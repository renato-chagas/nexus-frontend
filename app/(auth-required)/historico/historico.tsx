"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { assetHistoryService } from "@/services/models/asset_history.service";
import { assetService } from "@/services/models/assets.service";
import { employeeService } from "@/services/models/employee.service";
import { AssetHistory, Asset, Employee } from "@/types";

interface HistoryWithAsset extends AssetHistory {
  asset?: Asset;
}

const ACTION_LABELS: Record<string, string> = {
  CHECKOUT: "Entregue ao funcionário",
  CHECKIN: "Retornado ao inventário",
  MAINTENANCE: "Enviado para manutenção",
  DISPOSAL: "Descartado",
};

const ACTION_COLORS: Record<string, string> = {
  CHECKOUT: "bg-blue-100 text-blue-700",
  CHECKIN: "bg-green-100 text-green-700",
  MAINTENANCE: "bg-yellow-100 text-yellow-700",
  DISPOSAL: "bg-red-100 text-red-700",
};

export default function Historico() {
  const { accessToken } = useAuth();
  const [history, setHistory] = useState<HistoryWithAsset[]>([]);
  const [employees, setEmployees] = useState<Map<number, Employee>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      // Tenta carregar o histórico diretamente
      let allHistory: HistoryWithAsset[] = [];

      try {
        const historyResponse = await assetHistoryService.getAll(accessToken);
        const historyData = Array.isArray(historyResponse)
          ? historyResponse
          : historyResponse.results || [];

        console.log("Histórico direto:", historyData);

        if (historyData.length > 0) {
          // Se conseguiu carregar direto, carrega os ativos para ter os dados completos
          const assetResponse = await assetService.getAll(accessToken);
          const assets = Array.isArray(assetResponse)
            ? assetResponse
            : assetResponse.results || [];

          const assetMap = new Map(assets.map((a) => [a.id, a]));

          allHistory = historyData.map((history) => ({
            ...history,
            asset: assetMap.get(history.asset_id),
          }));
        }
      } catch (e) {
        console.log(
          "Não conseguiu carregar do assetHistoryService, tentando extrair dos ativos",
        );
      }

      // Se não encontrou histórico direto, tenta extrair dos ativos
      if (allHistory.length === 0) {
        const assetResponse = await assetService.getAll(accessToken);
        const assets = Array.isArray(assetResponse)
          ? assetResponse
          : assetResponse.results || [];

        console.log("Assets carregados:", assets);

        assets.forEach((asset) => {
          console.log("Asset:", asset.name, "Histórico:", asset.asset_history);
          if (asset.asset_history && Array.isArray(asset.asset_history)) {
            asset.asset_history.forEach((history) => {
              allHistory.push({
                ...history,
                asset,
              });
            });
          }
        });
      }

      console.log("Histórico total:", allHistory);

      // Log detalhado do primeiro item para debug
      if (allHistory.length > 0) {
        console.log("Primeiro item do histórico (detalhado):", allHistory[0]);
        console.log("Campos do primeiro item:", Object.keys(allHistory[0]));
      }

      // Ordenar por data decrescente
      allHistory.sort((a, b) => {
        const dateA = new Date(a.action_date).getTime();
        const dateB = new Date(b.action_date).getTime();
        return dateB - dateA;
      });

      setHistory(allHistory);

      // Carregar dados dos funcionários
      const employeeIds = [
        ...new Set(allHistory.map((h) => h.employee).filter(Boolean)),
      ];

      console.log("Employee IDs:", employeeIds);

      if (employeeIds.length > 0) {
        const allEmployees = await employeeService.getAll(accessToken);
        const employees_data = Array.isArray(allEmployees)
          ? allEmployees
          : allEmployees.results || [];

        console.log("Employees carregados:", employees_data);

        const employeeMap = new Map<number, Employee>();
        employeeIds.forEach((id) => {
          const emp = employees_data.find((e) => e.id === id);
          if (emp) {
            employeeMap.set(id, emp);
          }
        });

        setEmployees(employeeMap);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(date);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico de Ativos</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="sticky top-0 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Ativo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Tipo de Ação
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Funcionário Responsável
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhum histórico encontrado
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => {
                  const employee = employees.get(item.employee || 0);
                  if (idx === 0) {
                    console.log("Item renderizado:", item);
                    console.log("Employee encontrado:", employee);
                    console.log("Item.employee (ID):", item.employee);
                  }
                  return (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {item.asset?.name || `Ativo #${item.asset_id}`}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {formatDate(item.action_date)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[item.action_type]}`}
                        >
                          {ACTION_LABELS[item.action_type]}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {employee
                          ? `${employee.name} ${employee.surname}`
                          : item.employee
                            ? `Funcionário #${item.employee}`
                            : "Sem informação"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {item.observaitions || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
