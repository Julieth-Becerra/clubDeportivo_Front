import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";

import EventService from "../../services/EventService";
import Modal from "../modal";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [eventData, setEventData] = useState({ name: "", date: "" });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response && error.response.data && error.response.data.status === "INTERNAL_SERVER_ERROR") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.message,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al obtener los eventos",
        });
      }
    }
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setEventData({
      id: event ? event.id || "" : "", // Manejar el caso cuando event es null
      name: event ? event.name || "" : "",
      date: event && event.date ? new Date(event.date) : null,
    });
    setDisplayModal(true);
    setIsEditing(!!event);
  };
  


  

  const hideEventModal = () => {
    setSelectedEvent(null);
    setEventData({ name: "", date: "" });
    setDisplayModal(false);
    setErrors({}); // Limpiar los errores al cerrar el modal
  };

  const addEvent = async () => {
    try {
      await EventService.addEvent(eventData);
      fetchEvents();
      hideEventModal();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Evento agregado correctamente",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      if (error.response && error.response.data && error.response.data.status === "INTERNAL_SERVER_ERROR") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.message,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al agregar evento",
        });
      }
    }
  };

  const editEvent = async () => {
    try {


      const dataToSend = {
        id: eventData.id,
        name: eventData.name,
        date: eventData.date,
      }
      const response = await EventService.updateEvent(selectedEvent.id, dataToSend);

      if (response.status === "INTERNAL_SERVER_ERROR") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `Error al actualizar evento ${response.message}`,
        });
      } else {

        fetchEvents();
        hideEventModal();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Evento actualizado correctamente",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      if (error.response && error.response.data && error.response.data.status === "INTERNAL_SERVER_ERROR") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.message,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al actualizar evento",
        });
      }
    }
  };

  const deleteEvent = async () => {
    try {
      await EventService.deleteEvent(selectedEvent.id);
      fetchEvents();
      hideEventModal();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Evento eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      if (error.response && error.response.data && error.response.data.status === "INTERNAL_SERVER_ERROR") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.message,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al eliminar evento",
        });
      }
    }
  };

  const handleFormSubmit = async () => {
    // Verificar campos requeridos antes de enviar el formulario
    const { name, date } = eventData;
    const errors = {};
    if (!name) errors.name = "El campo Nombre es requerido.";
    if (!date) errors.date = "El campo Fecha es requerido.";

    setErrors(errors);

    // Verificar si hay errores antes de continuar
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (isEditing) {
      editEvent();
    } else {
      addEvent();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: undefined });
  };

  const modalContent = (
    <form onSubmit={handleFormSubmit} className="modal-form">
      <div className="p-field">
        <span className="p-float-label">
          <InputText
            type="text"
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            className={errors.name ? "p-invalid" : ""}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
          <label htmlFor="name">Nombre</label>
        </span>
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <Calendar
            id="date"
            name="date"
            value={eventData.date}
            onChange={(e) =>
              setEventData((prevState) => ({
                ...prevState,
                date: e.value,
              }))
            }
            dateFormat="dd/mm/yy"
            className={errors.date ? "p-invalid" : ""}
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
          <label htmlFor="date">Fecha</label>
        </span>
      </div>
    </form>
  );

  const handleDeleteConfirmation = (rowData) => {
    setSelectedEvent(rowData); // Establecer el evento seleccionado antes de mostrar el modal de confirmación
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    deleteEvent();
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div>
      <h2>Eventos deportivos</h2>
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
            <div>
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => handleDeleteConfirmation(rowData)}
              />
              <Modal
                visible={confirmDelete}
                onHide={handleCancelDelete}
                title="Confirmar eliminación"
                content="¿Está seguro de que desea eliminar este evento?"
                buttonName="Eliminar"
                buttonAction={() => handleDelete(selectedEvent)}
                severity={"danger"}
              />
            </div>
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
      <Modal
        visible={displayModal}
        onHide={hideEventModal}
        title={selectedEvent ? "Editar Evento" : "Agregar Evento"}
        content={modalContent}
        buttonName="Guardar"
        buttonAction={handleFormSubmit}
      />
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default EventTable;
