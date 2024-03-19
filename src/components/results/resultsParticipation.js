import React, { useState, useEffect, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import ParticipationService from "../../services/ParticipationService";
import MemberService from "../../services/MemberService";
import EventService from "../../services/EventService";
import Modal from "../modal";
import { InputText } from "primereact/inputtext";

const ParticipationTable = () => {
  const [participations, setParticipations] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [member, setMember] = useState({});
  const [event, setEvent] = useState({});
  const [selectedParticipation, setSelectedParticipation] = useState({});
  const [displayModal, setDisplayModal] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  useEffect(() => {
    fetchParticipations();
    fetchMembers();
    fetchEvents();
  }, []);

  const fetchParticipations = async () => {
    const response = await ParticipationService.getAllParticipations();
    setParticipations(response);
  };

  const fetchMembers = async () => {
    const response = await MemberService.getAllMembers();
    setMembers(response.data);
  };

  const fetchEvents = async () => {
    const response = await EventService.getAllEvents();
    setEvents(response.data);
  };

  const getMember = async (id) => {
    try {
      const response = await MemberService.getMember(id);
      console.log("Member response data:", response.data);
      const { id: memberId, name, age, address, sportDiscipline } = response.data;
      setMember({ id: memberId, name, age, address, sportDiscipline });
      console.log("Member state after setting:", member);
    } catch (error) {
      console.error("Error fetching member:", error);
    }
  };

  const getEvent = async (id) => {
    try {
      const response = await EventService.getEvent(id);
      console.log("Event response data:", response.data);
      const { id: eventId, name, date } = response.data;
      setEvent({ id: eventId, name, date });
      console.log("Event state after setting:", event);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };


  const openParticipationModal = async (participation) => {
    setSelectedParticipation(participation);
    setDisplayModal(true);
  };

  const hideParticipationModal = () => {
    setSelectedParticipation({});
    setDisplayModal(false);
    setErrors({});
  };

  const editParticipation = async (participation) => {
    try {
      const response = await ParticipationService.updateParticipation(participation.id, participation);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Participación editada correctamente",
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message,
        });
      }


      fetchParticipations();
    } catch (error) {
      console.error("Error editing participation:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al editar la participación",
      });
    }
  };

  const deleteParticipation = async (participation) => {
    try {
      await ParticipationService.deleteParticipation(participation.id);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Participación eliminada correctamente",
      });
      fetchParticipations();
    } catch (error) {
      console.error("Error deleting participation:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la participación",
      });
    }
  };


  const handleFormSubmit = async () => {
    const errors = validateForm(selectedParticipation);
    if (Object.keys(errors).length === 0) {
      try {
        let response; // Definir la variable response fuera del bloque if/else

        if (selectedParticipation.id) {
          console.log("Editing participation:", selectedParticipation);
          response = await editParticipation(selectedParticipation);
        } else {
          // Obteniendo directamente los datos del miembro y del evento necesarios
          const memberId = selectedParticipation.member.id;
          const eventId = selectedParticipation.event.id;

          const selectedMember = members.find(member => member.id === memberId);
          const selectedEvent = events.find(event => event.id === eventId);

          // Creando el objeto de participación con los campos necesarios
          const participation = {
            id: selectedParticipation.id || 0,
            member: {
              id: selectedMember.id,
              name: selectedMember.name,
              age: selectedMember.age,
              address: selectedMember.address,
              sportDiscipline: selectedMember.sportDiscipline
            },
            event: {
              id: selectedEvent.id,
              name: selectedEvent.name,
              date: selectedEvent.date
            },
            position: selectedParticipation.position
          };

          response = await addParticipation(participation);

         

          if (response.id) {
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Participación guardada correctamente",
            });

            fetchParticipations();
            hideParticipationModal();
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: response.data.message,
            });
          }

        }
      } catch (error) {
        console.error("Error saving participation:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al guardar la participación",
        });
      }
    } else {
      setErrors(errors);
    }
  };





  const validateForm = (data) => {
    const errors = {};
    if (!data?.member?.id) {
      errors.member = "El participante es requerido.";
    }
    if (!data?.event?.id) {
      errors.event = "El evento es requerido.";
    }
    if (!data?.position) {
      errors.position = "La posición es requerida.";
    }
    return errors;
  };

  const addParticipation = async (participation) => {
    return await ParticipationService.addParticipation(participation);
  };



  const modalContent = (
    <form onSubmit={handleFormSubmit} className="modal-form">
      <div className="p-field">
        <label htmlFor="participant">Participante:</label>
        <Dropdown
          id="participant"
          name="participant"
          value={selectedParticipation?.member?.id || null}
          options={members.map(member => ({ label: member.name, value: member.id }))}
          onChange={(e) => setSelectedParticipation(prevState => ({ ...prevState, member: { id: e.value } }))}
          placeholder="Seleccione un participante"
          className={errors.member && 'p-invalid'}
        />
      </div>
      <div className="p-field">
        <label htmlFor="event">Evento:</label>
        <Dropdown
          id="event"
          name="event"
          value={selectedParticipation?.event?.id || null}
          options={events.map(event => ({ label: event.name, value: event.id }))}
          onChange={(e) => setSelectedParticipation(prevState => ({ ...prevState, event: { id: e.value } }))}
          placeholder="Seleccione un evento"
          className={errors.event && 'p-invalid'}
        />
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <InputText
            type="number"
            id="position"
            name="position"
            value={selectedParticipation?.position || ''}
            onChange={(e) => setSelectedParticipation(prevState => ({ ...prevState, position: e.target.value }))}
            className={errors.position && 'p-invalid'}
          />
          <label htmlFor="position">Posición</label>
        </span>
      </div>
    </form>
  );

  return (
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
        <Button
          label="Agregar Participación"
          icon="pi pi-plus"
          className="p-button-rounded p-button-success"
          onClick={() => openParticipationModal(null)}
        />
      </div>
      <Modal
        visible={displayModal}
        onHide={hideParticipationModal}
        title={selectedParticipation ? "Editar Participación" : "Agregar Participación"}
        content={modalContent}
        buttonName="Guardar"
        buttonAction={handleFormSubmit}
      />
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default ParticipationTable;
