"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { softwareService } from "@/services/models/software.service";
import { assetService } from "@/services/models/assets.service";
import { Button, Input } from "@/components/ui";
import { Software, Asset } from "@/types";

export default function Softwares() {
  const { accessToken } = useAuth();
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Software>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSoftware, setNewSoftware] = useState({ name: "", version: "" });

  useEffect(() => {
    loadSoftwares();
    loadAssets();
  }, []);

  const loadSoftwares = async () => {
    try {
      setLoading(true);
      const response = await softwareService.getAll(accessToken);
      const softwaresArray = Array.isArray(response)
        ? response
        : response?.results || [];
      setSoftwares(softwaresArray);
    } catch (error) {
      console.error("Erro ao carregar softwares:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      const response = await assetService.getAll(accessToken);
      const assetsArray = Array.isArray(response)
        ? response
        : response?.results || [];

      // Adicionar fallback para installed_software se não vier do backend
      const assetsWithDefaults = assetsArray.map((asset) => ({
        ...asset,
        installed_software: asset.installed_software || [],
      }));

      setAssets(assetsWithDefaults);
    } catch (error) {
      console.error("Erro ao carregar ativos:", error);
    }
  };

  const countSoftwareUsage = (softwareId: number): number => {
    return assets.filter((asset) =>
      asset.installed_software?.some((sw) => sw.id === softwareId),
    ).length;
  };

  const getTotalInstances = (): number => {
    return assets.reduce((total, asset) => {
      return total + (asset.installed_software?.length || 0);
    }, 0);
  };

  const getPercentage = (count: number): number => {
    const total = getTotalInstances();
    if (total === 0) return 0;
    return (count / total) * 100;
  };

  const openEditModal = (software: Software) => {
    setEditingId(software.id);
    setEditFormData(software);
  };

  const closeEditModal = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const saveEditedSoftware = async () => {
    if (!editingId) return;
    try {
      await softwareService.patch(editingId, editFormData, accessToken);
      setSoftwares((prev) =>
        prev.map((sw) =>
          sw.id === editingId ? { ...sw, ...editFormData } : sw,
        ),
      );
      closeEditModal();
      // Recarregar assets para atualizar contagem
      loadAssets();
    } catch (error) {
      console.error("Erro ao atualizar software:", error);
    }
  };

  const deleteSoftware = async (id: number) => {
    try {
      await softwareService.delete(id, accessToken);
      setSoftwares((prev) => prev.filter((sw) => sw.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error("Erro ao deletar software:", error);
    }
  };

  const createSoftware = async () => {
    if (!newSoftware.name || !newSoftware.version) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      const response = await softwareService.create(newSoftware, accessToken);
      setSoftwares((prev) => [...prev, response]);
      setShowCreateModal(false);
      setNewSoftware({ name: "", version: "" });
      // Recarregar assets para atualizar contagem
      loadAssets();
    } catch (error) {
      console.error("Erro ao criar software:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando softwares...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Softwares Instalados</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="text-sm py-1 px-3"
        >
          Adicionar
        </Button>
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
                  SOFTWARE
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  VERSÃO
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  QUANTIDADE
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  PERCENTUAL
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody>
              {softwares.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhum software encontrado
                  </td>
                </tr>
              ) : (
                softwares.map((software) => {
                  const count = countSoftwareUsage(software.id);
                  const percentage = getPercentage(count).toFixed(1);
                  return (
                    <tr
                      key={software.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {software.id}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                        {software.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {software.version}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {count} {count === 1 ? "ativo" : "ativos"}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-center">
                        <Button
                          variant="primary"
                          onClick={() => openEditModal(software)}
                          className="text-xs py-1 px-2"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setDeletingId(software.id)}
                          className="text-xs py-1 px-2"
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Editar Software</h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Nome"
                placeholder="Digite o nome do software"
                value={editFormData.name || ""}
                onChange={(value) =>
                  setEditFormData({ ...editFormData, name: value })
                }
              />
              <Input
                label="Versão"
                placeholder="ex: 1.0.0"
                value={editFormData.version || ""}
                onChange={(value) =>
                  setEditFormData({ ...editFormData, version: value })
                }
              />
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
                onClick={saveEditedSoftware}
                className="text-sm py-1 px-3"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Deletar */}
      {deletingId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Confirmar Deleção</h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar este software? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex justify-between gap-4">
              <Button
                variant="secondary"
                onClick={() => setDeletingId(null)}
                className="text-sm py-1 px-3"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => deletingId && deleteSoftware(deletingId)}
                className="text-sm py-1 px-3"
              >
                Deletar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Novo Software</h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Nome"
                placeholder="Digite o nome do software"
                value={newSoftware.name}
                onChange={(value) =>
                  setNewSoftware({ ...newSoftware, name: value })
                }
              />
              <Input
                label="Versão"
                placeholder="ex: 1.0.0"
                value={newSoftware.version}
                onChange={(value) =>
                  setNewSoftware({ ...newSoftware, version: value })
                }
              />
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="text-sm py-1 px-3"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={createSoftware}
                className="text-sm py-1 px-3"
              >
                Criar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
