"use client";

import { useEffect, useState } from "react";

import { employeeService, Employee } from "@/services/models/employee.service";
import { Button, Input } from "@/components/ui";

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState<Partial<Employee>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      const employeesArray = Array.isArray(response)
        ? response
        : response?.results || [];
      setEmployees(employeesArray);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este funcionário?")) {
      try {
        await employeeService.delete(id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } catch (error) {
        console.error("Erro ao deletar funcionário:", error);
      }
    }
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditFormData(employee);
  };

  const closeEditModal = () => {
    setEditingEmployee(null);
    setEditFormData({});
  };

  const saveEditedEmployee = async () => {
    if (!editingEmployee) return;
    try {
      await employeeService.patch(editingEmployee.id, editFormData);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...editFormData } : emp,
        ),
      );
      closeEditModal();
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setDeletingEmployeeId(id);
  };

  const confirmDelete = async () => {
    if (deletingEmployeeId) {
      try {
        await employeeService.delete(deletingEmployeeId);
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== deletingEmployeeId),
        );
        setDeletingEmployeeId(null);
      } catch (error) {
        console.error("Erro ao deletar funcionário:", error);
      }
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewEmployee({
      name: "",
      surname: "",
      email: "",
      phone: "",
      department: "",
    });
  };

  const createEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.surname ||
      !newEmployee.email ||
      !newEmployee.phone ||
      !newEmployee.department
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      const response = await employeeService.create(newEmployee as Employee);
      setEmployees((prev) => [...prev, response]);
      closeCreateModal();
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="h-full w-full flex justify-center p-6">
      <div className="flex flex-col w-full gap-6">
        {/* Tabela de Funcionários */}
        <div className="w-full rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Lista de Funcionários</h2>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              className="text-sm py-1 px-3"
            >
              Adicionar
            </Button>
          </div>
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 sticky top-0">
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">NOME</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    SOBRENOME
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">EMAIL</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    TELEFONE
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    DEPARTAMENTO
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    DATA CONTRATAÇÃO
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">
                      Carregando funcionários...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">
                      Nenhum funcionário encontrado
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{employee.id}</td>
                      <td className="py-3 px-4">{employee.name}</td>
                      <td className="py-3 px-4">{employee.surname}</td>
                      <td className="py-3 px-4 text-blue-600 truncate">
                        {employee.email}
                      </td>
                      <td className="py-3 px-4">{employee.phone}</td>
                      <td className="py-3 px-4">{employee.department}</td>
                      <td className="py-3 px-4">
                        {formatDate(employee.hire_date)}
                      </td>
                      <td className="py-3 px-4 flex gap-2 justify-center">
                        <Button
                          variant="primary"
                          onClick={() => openEditModal(employee)}
                          className="text-xs py-1 px-2"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => openDeleteConfirm(employee.id)}
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
        {editingEmployee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Editar Funcionário</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nome"
                  placeholder="Digite o nome"
                  value={editFormData.name || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, name: value })
                  }
                />
                <Input
                  label="Sobrenome"
                  placeholder="Digite o sobrenome"
                  value={editFormData.surname || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, surname: value })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Digite o email"
                  value={editFormData.email || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, email: value })
                  }
                />
                <Input
                  label="Telefone"
                  placeholder="Digite o telefone"
                  value={editFormData.phone || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, phone: value })
                  }
                />
                <Input
                  label="Departamento"
                  placeholder="Digite o departamento"
                  value={editFormData.department || ""}
                  onChange={(value) =>
                    setEditFormData({ ...editFormData, department: value })
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
                  onClick={saveEditedEmployee}
                  className="text-sm py-1 px-3"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Deletar */}
        {deletingEmployeeId !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Confirmar Deleção</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar este funcionário? Esta ação não
                pode ser desfeita.
              </p>
              <div className="flex justify-between gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setDeletingEmployeeId(null)}
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

        {/* Modal de Criação de Funcionário */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Novo Funcionário</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nome"
                  placeholder="Digite o nome"
                  value={newEmployee.name || ""}
                  onChange={(value) =>
                    setNewEmployee({ ...newEmployee, name: value })
                  }
                />
                <Input
                  label="Sobrenome"
                  placeholder="Digite o sobrenome"
                  value={newEmployee.surname || ""}
                  onChange={(value) =>
                    setNewEmployee({ ...newEmployee, surname: value })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Digite o email"
                  value={newEmployee.email || ""}
                  onChange={(value) =>
                    setNewEmployee({ ...newEmployee, email: value })
                  }
                />
                <Input
                  label="Telefone"
                  placeholder="Digite o telefone"
                  value={newEmployee.phone || ""}
                  onChange={(value) =>
                    setNewEmployee({ ...newEmployee, phone: value })
                  }
                />
                <Input
                  label="Departamento"
                  placeholder="Digite o departamento"
                  value={newEmployee.department || ""}
                  onChange={(value) =>
                    setNewEmployee({ ...newEmployee, department: value })
                  }
                />
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
                  onClick={createEmployee}
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
