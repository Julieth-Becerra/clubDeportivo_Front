import React, { useState, useEffect, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import ParticipationService from "../../services/ParticipationService";

const ParticipationTable = () => {
  const [participations, setParticipations] = useState([]);
  const [selectedParticipation, setSelectedParticipation] = useState(null);
  const [displayModal, setDisplayModal] = useState(false)
  const toast = useRef(null)

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    const response = await ParticipationService.getAllParticipations()
    console.log(response.data)
    setParticipations(response.data);
  };

  const openParticipationModal = (participation) => {
    setSelectedParticipation(participation);
    setDisplayModal(true);
  };

  const hideParticipationModal = () => {
    setSelectedParticipation(null);
    setDisplayModal(false);
  };

  const deleteParticipation = (participation) => {
    // Lógica para eliminar un miembro
  };

  return(
    <div>
        <h2 className="title">Resultados del Club Deportivo</h2>
      <DataTable value={participations} className="p-datatable-striped">
        <Column field="member.name" header="Nombre" sortable></Column>
        <Column field="event.name" header="Evento" sortable></Column>
        <Column field="position" header="Posición" sortable></Column>
        <Column
          header="Editar"
          body={(rowData) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-primary"
              onClick={() => openParticipationModal(rowData)}
            />
          )}
          headerStyle={{ width: '8rem' }}
        ></Column>
        <Column
          header="Eliminar"
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger"
              onClick={() => deleteParticipation(rowData)}
            />
          )}
          headerStyle={{ width: '8rem' }}
        ></Column>
      </DataTable>
      <div className="button-container">
        <Button label="Agregar Paticipación" icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => openParticipationModal(null)} />
      </div>
      <Dialog visible={displayModal} onHide={hideParticipationModal}>
        {/* Contenido del modal para agregar/editar Participacións */}
        <h2>{selectedParticipation ? 'Editar Participación' : 'Agregar Participación'}</h2>
        {/* Aquí puedes colocar los campos del formulario para agregar/editar Participacións */}
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </div>
  )
};

export default ParticipationTable;
