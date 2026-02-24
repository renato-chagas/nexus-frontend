"use client";

import { useEffect, useState } from "react";

import { categoryService } from "@/services/models/categorias.service";
import { CreateCategoryDTO } from "@/types";

import { Input, Button } from "@/components/ui";

interface Categoria extends CreateCategoryDTO {
  id: number;
  quantity?: number;
}

export default function Categorias() {
  const [modal, showModal] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [newCategory, setNewCategory] = useState<CreateCategoryDTO>({
    name: "",
    tracks_software: false,
    description: "",
  });

  // Carregar categorias

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategorias(response.results);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  // Deletar categoria

  const deleteCategory = async (id: number) => {
    try {
      await categoryService.delete(id);
      console.log(`Categoria ${id} deletada com sucesso`);
      setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  // Criar categoria

  const createCategory = async () => {
    try {
      const response = await categoryService.create(newCategory);
      setCategorias((prev) => [...prev, response]);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  //calculo % de cada categoria
  const total = categorias.reduce(
    (acc, categoria) => acc + categoria.quantity!,
    0,
  );

  return (
    <div className="min-h-screen w-full flex justify-center p-6">
      <div className="flex flex-col w-full max-w-5xl">
        <div className="shadow-sm rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Categorias</h2>
            <Button
              onClick={() => showModal(true)}
              variant="primary"
              className="text-sm py-1 px-3"
            >
              Adicionar
            </Button>
          </div>
          <div className="overflow-auto max-h-[350px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 sticky top-0">
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">NOME</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    QUANTIDADE
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    PERCENTUAL
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                ) : (
                  categorias.map((categoria) => {
                    const porcentagem =
                      total > 0
                        ? Math.round((categoria.quantity! / total) * 100)
                        : 0;

                    return (
                      <tr
                        key={categoria.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{categoria.id}</td>
                        <td className="py-3 px-4">{categoria.name}</td>
                        <td className="py-3 px-4">{categoria.quantity || 0}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {porcentagem}%
                          </span>
                        </td>
                        <td className="py-3 px-4 flex gap-2 justify-center">
                          <Button
                            variant="danger"
                            onClick={() => deleteCategory(categoria.id)}
                            className="text-xs py-1 px-2"
                          >
                            Excluir
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
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Nova Categoria</h2>
            <div className="flex flex-col gap-2">
              <Input
                label="Nome da Categoria"
                placeholder="Digite o nome da categoria"
                value={newCategory.name}
                onChange={(value: string) =>
                  setNewCategory({
                    ...newCategory,
                    name: value,
                  })
                }
              />
              <Input
                type="checkbox"
                label="Rastrear Software"
                value={newCategory.tracks_software ? "true" : "false"}
                onChange={(value: string) =>
                  setNewCategory({
                    ...newCategory,
                    tracks_software: value === "true",
                  })
                }
              />

              {newCategory.tracks_software && (
                <Input
                  type="textarea"
                  label="Descrição"
                  horizontal
                  placeholder="Digite a descrição da categoria"
                  value={newCategory.description || ""}
                  onChange={(value: string) =>
                    setNewCategory({
                      ...newCategory,
                      description: value,
                    })
                  }
                />
              )}
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="secondary"
                onClick={() => showModal(false)}
                className="text-sm py-1 px-3"
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  createCategory();
                  showModal(false);
                }}
                className="text-sm py-1 px-3"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
