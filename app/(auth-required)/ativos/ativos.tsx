"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { assetService, Asset } from "@/services/models/assets.service";
import { employeeService } from "@/services/models/employee.service";
import { softwareService } from "@/services/models/software.service";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Select } from "@/components/ui";
import { Employee, Software } from "@/types";

export default function Ativos() {
  const { accessToken } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Asset>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: "",
    person_in_charge_id: null,
    status: "AVAILABLE",
    specs: "",
    installed_software: [],
  });

  useEffect(() => {
    loadAssets();
    loadEmployees();
    loadSoftwares();
  }, []);

  const loadSoftwares = async () => {
    try {
      const response = await softwareService.getAll(accessToken);
      const softwaresArray = Array.isArray(response)
        ? response
        : response?.results || [];
      setSoftwares(softwaresArray);
    } catch (error) {
      console.error("Erro ao carregar softwares:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll(accessToken);
      const employeesArray = Array.isArray(response)
        ? response
        : response?.results || [];
      setEmployees(employeesArray);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  const loadAssets = async () => {
    try {
      const response = await assetService.getAll();
      const assetsArray = Array.isArray(response)
        ? response
        : response?.results || [];
      
      // Adicionar fallback para installed_software se não vier do backend
      const assetsWithDefaults = assetsArray.map((asset) => ({
        ...asset,
        installed_software: asset.installed_software || [],
      }));
      
      setAssets(assetsWithDefaults);
      console.log(response);
    } catch (error) {
      console.error("Erro ao carregar ativos:", error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este ativo?")) {
      try {
        await assetService.delete(id);
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
      } catch (error) {
        console.error("Erro ao deletar ativo:", error);
      }
    }
  };

  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setEditFormData(asset);
  };

  const closeEditModal = () => {
    setEditingAsset(null);
    setEditFormData({});
  };

  const saveEditedAsset = async () => {
    if (!editingAsset) return;
    try {
      // Enviar apenas os campos que devem ser atualizados
      const dataToSend = {
        name: editFormData.name,
        person_in_charge_id: editFormData.person_in_charge_id,
        status: editFormData.status,
        specs: editFormData.specs,
        installed_software: editFormData.installed_software?.map((sw) => sw.id) || [],
      };
      await assetService.patch(editingAsset.id, dataToSend, accessToken);
      // Recarregar assets para trazer dados atualizados do backend
      await loadAssets();
      closeEditModal();
    } catch (error) {
      console.error("Erro ao atualizar ativo:", error);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setDeletingAssetId(id);
  };

  const confirmDelete = async () => {
    if (deletingAssetId) {
      try {
        await assetService.delete(deletingAssetId, accessToken);
        setAssets((prev) =>
          prev.filter((asset) => asset.id !== deletingAssetId),
        );
        setDeletingAssetId(null);
      } catch (error) {
        console.error("Erro ao deletar ativo:", error);
      }
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewAsset({
      name: "",
      person_in_charge_id: null,
      status: "AVAILABLE",
      specs: "",
      installed_software: [],
    });
  };

  const createAsset = async () => {
    if (!newAsset.name) {
      alert("Preencha o nome do ativo");
      return;
    }
    try {
      // Converter softwares para IDs antes de enviar
      const dataToSend = {
        ...newAsset,
        installed_software: newAsset.installed_software?.map((sw) => sw.id) || [],
      };
      const response = await assetService.create(dataToSend as Asset, accessToken);
      setAssets((prev) => [...prev, response]);
      closeCreateModal();
    } catch (error) {
      console.error("Erro ao criar ativo:", error);
    }
  };

  // Contar ativos por status
  const statusCounts = {
    IN_USE: assets.filter((a) => a.status === "IN_USE").length,
    MAINTENANCE: assets.filter((a) => a.status === "MAINTENANCE").length,
    AVAILABLE: assets.filter((a) => a.status === "AVAILABLE").length,
    UNAVAILABLE: assets.filter((a) => a.status === "UNAVAILABLE").length,
  };

  const chartData = [
    { name: "Em Uso", value: statusCounts.IN_USE, color: "#10b981" },
    { name: "Manutenção", value: statusCounts.MAINTENANCE, color: "#f59e0b" },
    { name: "Disponível", value: statusCounts.AVAILABLE, color: "#3b82f6" },
    { name: "Indisponível", value: statusCounts.UNAVAILABLE, color: "#ef4444" },
  ];

  const getEmployeeName = (asset: Asset) => {
    // Primeiro tenta usar o objeto completo que vem do backend
    if (asset.person_in_charge) {
      return `${asset.person_in_charge.name} ${asset.person_in_charge.surname}`;
    }
    // Se não tiver, tenta buscar pelo ID nos funcionários carregados
    if (asset.person_in_charge_id && employees.length > 0) {
      const employee = employees.find(
        (e) => e.id === asset.person_in_charge_id,
      );
      return employee ? `${employee.name} ${employee.surname}` : "Desconhecido";
    }
    return "Não atribuído";
  };

  const getSoftwareInstallCount = (softwareId: number): number => {
    return assets.filter((asset) =>
      asset.installed_software?.some((sw) => sw.id === softwareId)
    ).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_USE":
        return "bg-green-100 text-green-700";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700";
      case "AVAILABLE":
        return "bg-blue-100 text-blue-700";
      case "UNAVAILABLE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_USE":
        return "Em Uso";
      case "MAINTENANCE":
        return "Manutenção";
      case "AVAILABLE":
        return "Disponível";
      case "UNAVAILABLE":
        return "Indisponível";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-6">
      <div className="flex flex-col w-full gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico */}
          <div className="rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Distribuição de Ativos
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Estatísticas */}
          <div className="rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Estatísticas</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Em Uso</span>
                <span className="font-semibold text-green-700">
                  {statusCounts.IN_USE}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Manutenção</span>
                <span className="font-semibold text-yellow-700">
                  {statusCounts.MAINTENANCE}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Disponível</span>
                <span className="font-semibold text-blue-700">
                  {statusCounts.AVAILABLE}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Indisponível</span>
                <span className="font-semibold text-red-700">
                  {statusCounts.UNAVAILABLE}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-t-2 border-gray-300 mt-2">
                <span className="text-gray-700 font-semibold">Total</span>
                <span className="font-semibold text-gray-700">
                  {assets.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Ativos */}
        <div className="w-full rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lista de Ativos</h2>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              className="text-sm py-1 px-3"
            >
              Adicionar
            </Button>
          </div>
          <div className="overflow-auto max-h-[350px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">NOME</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    RESPONSÁVEL
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">STATUS</th>
                  <th className="text-center py-3 px-4 font-semibold">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      Carregando ativos...
                    </td>
                  </tr>
                ) : assets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      Nenhum ativo encontrado
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{asset.id}</td>
                      <td className="py-3 px-4">{asset.name}</td>
                      <td className="py-3 px-4">{getEmployeeName(asset)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            asset.status,
                          )}`}
                        >
                          {getStatusLabel(asset.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2 justify-center">
                        <Button
                          variant="primary"
                          onClick={() => openEditModal(asset)}
                          className="text-xs py-1 px-2"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => openDeleteConfirm(asset.id)}
                          className="text-xs py-1 px-2"
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Edição */}
        {editingAsset && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Editar Ativo</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nome"
                  placeholder="Digite o nome do ativo"
                  value={editFormData.name || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, name: value })
                  }
                />
                <Select
                  label="Responsável"
                  value={String(editFormData.person_in_charge_id || "")}
                  onChange={(value) =>
                    setEditFormData({
                      ...editFormData,
                      person_in_charge_id: value ? parseInt(value) : null,
                    })
                  }
                  options={[
                    { label: "Nenhum", value: "" },
                    ...employees.map((emp) => ({
                      label: `${emp.name} ${emp.surname}`,
                      value: String(emp.id),
                    })),
                  ]}
                />
                <Select
                  label="Status"
                  value={editFormData.status || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                  options={[
                    { label: "Em Uso", value: "IN_USE" },
                    { label: "Manutenção", value: "MAINTENANCE" },
                    { label: "Disponível", value: "AVAILABLE" },
                    { label: "Indisponível", value: "UNAVAILABLE" },
                  ]}
                />
                <Input
                  label="Descrição"
                  placeholder="Digite a descrição"
                  value={editFormData.specs || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, specs: value })
                  }
                />
                <div className="border-t pt-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Softwares Instalados
                  </label>
                  <div className="mt-2 space-y-2 max-h-[200px] overflow-auto">
                    {softwares.map((software) => {
                      const isSelected = editFormData.installed_software?.some(
                        (sw) => sw.id === software.id
                      );
                      const installCount = getSoftwareInstallCount(software.id);
                      return (
                        <label
                          key={software.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditFormData({
                                  ...editFormData,
                                  installed_software: [
                                    ...(editFormData.installed_software || []),
                                    software,
                                  ],
                                });
                              } else {
                                setEditFormData({
                                  ...editFormData,
                                  installed_software: editFormData.installed_software?.filter(
                                    (sw) => sw.id !== software.id
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4 cursor-pointer flex-shrink-0"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {software.name} v{software.version}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {installCount} ativo{installCount !== 1 ? "s" : ""}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-4 mt-6">
                <Button
                  variant="secondary"
                  onClick={closeEditModal}
                  className="text-sm py-1 px-3"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={saveEditedAsset}
                  className="text-sm py-1 px-3"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Deletar */}
        {deletingAssetId !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Confirmar Deleção</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar este ativo? Esta ação não pode
                ser desfeita.
              </p>
              <div className="flex justify-between gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setDeletingAssetId(null)}
                  className="text-sm py-1 px-3"
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="text-sm py-1 px-3"
                >
                  Deletar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Criação de Ativo */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Novo Ativo</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nome"
                  placeholder="Digite o nome do ativo"
                  value={newAsset.name || ""}
                  onChange={(value) =>
                    setNewAsset({ ...newAsset, name: value })
                  }
                />
                <Select
                  label="Responsável"
                  value={String(newAsset.person_in_charge_id || "")}
                  onChange={(value) =>
                    setNewAsset({
                      ...newAsset,
                      person_in_charge_id: value ? parseInt(value) : null,
                    })
                  }
                  options={[
                    { label: "Nenhum", value: "" },
                    ...employees.map((emp) => ({
                      label: `${emp.name} ${emp.surname}`,
                      value: String(emp.id),
                    })),
                  ]}
                />
                <Select
                  label="Status"
                  value={newAsset.status || "AVAILABLE"}
                  onChange={(value) =>
                    setNewAsset({ ...newAsset, status: value })
                  }
                  options={[
                    { label: "Em Uso", value: "IN_USE" },
                    { label: "Manutenção", value: "MAINTENANCE" },
                    { label: "Disponível", value: "AVAILABLE" },
                    { label: "Indisponível", value: "UNAVAILABLE" },
                  ]}
                />
                <Input
                  label="Descrição"
                  placeholder="Digite a descrição do ativo"
                  value={newAsset.specs || ""}
                  onChange={(value) =>
                    setNewAsset({ ...newAsset, specs: value })
                  }
                />
                <div className="border-t pt-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Softwares Instalados
                  </label>
                  <div className="mt-2 space-y-2 max-h-[200px] overflow-auto">
                    {softwares.map((software) => {
                      const isSelected = newAsset.installed_software?.some(
                        (sw) => sw.id === software.id
                      );
                      const installCount = getSoftwareInstallCount(software.id);
                      return (
                        <label
                          key={software.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected || false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAsset({
                                  ...newAsset,
                                  installed_software: [
                                    ...(newAsset.installed_software || []),
                                    software,
                                  ],
                                });
                              } else {
                                setNewAsset({
                                  ...newAsset,
                                  installed_software: newAsset.installed_software?.filter(
                                    (sw) => sw.id !== software.id
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4 cursor-pointer flex-shrink-0"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {software.name} v{software.version}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {installCount} ativo{installCount !== 1 ? "s" : ""}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-4 mt-6">
                <Button
                  variant="secondary"
                  onClick={closeCreateModal}
                  className="text-sm py-1 px-3"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={createAsset}
                  className="text-sm py-1 px-3"
                >
                  Criar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
