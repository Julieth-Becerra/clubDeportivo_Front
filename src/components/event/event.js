import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import EventService from "../../services/EventService";

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await EventService.getAllEvents();
    setEvents(response.data);
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setDisplayModal(true);
  };

  const hideEventModal = () => {
    setSelectedEvent(null);
    setDisplayModal(false);
  };

  const deleteEvent = (event) => {
    // Lógica para eliminar un miembro
  };

  return (
    <div>
      <h2 className="title">Eventos deportivos</h2>
      <DataTable value={events} className="p-datatable-striped">
        <Column field="name" header="Nombre" sortable></Column>
        <Column field="date" header="Fecha" sortable></Column>
        <Column
          header="Editar"
          body={(rowData) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-primary"
              onClick={() => openEventModal(rowData)}
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
              onClick={() => deleteEvent(rowData)}
            />
          )}
          headerStyle={{ width: "8rem" }}
        ></Column>
      </DataTable>
      <div className="button-container">
        <Button
          label="Agregar Evento"
          icon="pi pi-plus"
          className="p-button-rounded p-button-success"
          onClick={() => openEventModal(null)}
        />
      </div>
      <Dialog visible={displayModal} onHide={hideEventModal}>
        {/* Contenido del modal para agregar/editar Eventos */}
        <h2>{selectedEvent ? "Editar Event" : "Agregar Event"}</h2>
        {/* Aquí puedes colocar los campos del formulario para agregar/editar Eventos */}
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default EventTable;
