import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

import SportDisciplineService from "../../services/SportDisciplineService";
import Modal from "../modal";
import { InputText } from "primereact/inputtext";

const SportDiciplineTable = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [disciplineData, setDisciplineData] = useState({ name: '', type: '' });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    const response = await SportDisciplineService.getAllSportDisciplines();
    setDisciplines(response.data);
  };

  const openDisciplineModal = (discipline) => {

    setSelectedDiscipline(discipline);
    setDisciplineData(discipline || { name: '', type: '' });
    setDisplayModal(true);
    setIsEditing(!!discipline);
  };

  const hideDisciplineModal = () => {
    setSelectedDiscipline(null);
    setDisciplineData({ name: '', type: '' });
    setDisplayModal(false);
    setErrors({}); // Limpiar los errores al cerrar el modal
  };

  const addDiscipline = async () => {
    try {
      await SportDisciplineService.addSportDiscipline(disciplineData);
      fetchDisciplines();
      hideDisciplineModal();
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Disciplina agregada correctamente' });
    } catch (error) {
      console.error('Error adding discipline:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al agregar disciplina' });
    }
  };

  const editDiscipline = async () => {
    try {
      const response = await SportDisciplineService.updateSportDiscipline(selectedDiscipline.id, disciplineData);

      if (response.status === "INTERNAL_SERVER_ERROR") {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar disciplina' });
      } else {
        fetchDisciplines();
        hideDisciplineModal();
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Disciplina actualizada correctamente' });
      }


    } catch (error) {
      console.error('Error updating discipline:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar disciplina' });
    }
  };

  const deleteDiscipline = async (data) => {
    console.log(data);
    try {

      await SportDisciplineService.deleteSporDiscipline(data.id);
      fetchDisciplines();
      hideDisciplineModal();
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Disciplina eliminada correctamente' });
    } catch (error) {
      console.error('Error deleting discipline:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar disciplina' });
    }
  };

  const handleFormSubmit = async () => {
    // Verificar campos requeridos antes de enviar el formulario
    const { name, type } = disciplineData;
    const errors = {};
    if (!name) errors.name = 'El campo Nombre es requerido.';
    if (!type) errors.type = 'El campo Tipo es requerido.';

    setErrors(errors);

    // Verificar si hay errores antes de continuar
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (isEditing) {
      editDiscipline();
    } else {
      await addDiscipline();
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisciplineData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors({ ...errors, [name]: undefined });
  };

  const modalContent = (
    <form onSubmit={handleFormSubmit} className="modal-form">
      <div className="p-field">
        <span className="p-float-label">
          <InputText type="text" id="name" name="name" value={disciplineData.name} onChange={handleChange} className={errors.name ? 'p-invalid' : ''} />
          {errors.name && <small className="p-error">{errors.name}</small>}
          <label htmlFor="name">Nombre</label>
        </span>
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <Dropdown
            id="type"
            name="type"
            value={disciplineData.type}
            options={[
              { label: 'Individual', value: 'INDIVIDUAL' },
              { label: 'Grupal', value: 'GRUPAL' }
            ]}
            onChange={handleChange}
            className={errors.type ? 'p-invalid' : ''}
            placeholder="Seleccione el tipo"
          />
          {errors.type && <small className="p-error">{errors.type}</small>}
          <label htmlFor="type">Tipo</label>
        </span>
      </div>
    </form>
  );



  return (
    <div>
      <h2>Sport Discipline</h2>
      <DataTable value={disciplines} className="p-datatable-striped">
        <Column field="name" header="Nombre" sortable></Column>
        <Column field="type" header="Tipo" sortable></Column>
        <Column
          header="Editar"
          body={(rowData) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-primary"
              onClick={() => openDisciplineModal(rowData)}
            />
          )}
          headerStyle={{ width: "8rem" }}
        ></Column>
        <Column
          header="Eliminar"
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger"
              onClick={() => {
                deleteDiscipline(rowData); // Llama a la función para eliminar la disciplina
              }}
            />
          )}
          headerStyle={{ width: "8rem" }}
        ></Column>

      </DataTable>
      <div className="button-container">
        <Button label="Agregar Disciplina" icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => openDisciplineModal(null)} />
      </div>
      <Modal
        visible={displayModal}
        onHide={hideDisciplineModal}
        title={selectedDiscipline ? 'Editar Disciplina' : 'Agregar Disciplina'}
        content={modalContent}
        buttonName="Guardar"
        buttonAction={handleFormSubmit}
      />
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default SportDiciplineTable;
