import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import SportDisciplineService from "../../services/SportDisciplineService";

const SportDiciplineTable = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    const response = await SportDisciplineService.getAllSportDisciplines();
    setDisciplines(response.data);
  };

  const openDisciplineModal = (discipline) => {
    setSelectedDiscipline(discipline)
    setDisplayModal(true)
  }

  const hideDisciplineModal = () => {
    setSelectedDiscipline(null)
    setDisplayModal(false)
  }

  const deleteDiscipline = (discipline) => {

  }

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
              onClick={() => deleteDiscipline(rowData)}
            />
          )}
          headerStyle={{ width: "8rem" }}
        ></Column>
      </DataTable>
      <div className="button-container">
        <Button label="Agregar Disciplina" icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => openDisciplineModal(null)} />
      </div>
      <Dialog visible={displayModal} onHide={hideDisciplineModal}>
        {/* Contenido del modal para agregar/editar Disciplina */}
        <h2>{selectedDiscipline ? 'Editar Disciplina' : 'Agregar Disciplina'}</h2>
        {/* Aquí puedes colocar los campos del formulario para agregar/editar Disciplina */}
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default SportDiciplineTable;
