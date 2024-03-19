import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MemberService from '../../services/MemberService';
import SportDisciplineServise from '../../services/SportDisciplineService';
import './styles.css';

import Modal from '../modal';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [sportDisciplines, setSportDisciplines] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [confirmModalProps, setConfirmModalProps] = useState({
    visible: false,
    title: '',
    buttonName: '',
    severity: '',
    buttonAction: null,
  });

  useEffect(() => {
    fetchMembers();
    getDisciplines();

  }, []);


  const fetchMembers = async () => {
    const response = await MemberService.getAllMembers();
    setMembers(response.data);
  };

  const getDisciplines = async () => {
    const response = await SportDisciplineServise.getAllSportDisciplines();
    setSportDisciplines(response.data);
  }

  const openMemberModal = (member) => {
    if (member) {
      // Si hay un miembro seleccionado, busca la disciplina deportiva correspondiente en el array de disciplinas deportivas y asígnala al miembro seleccionado
      const selectedDiscipline = sportDisciplines.find(discipline => discipline.id === member.sportDiscipline.id);
     
      setSelectedMember({
        ...member,
        sportDiscipline: selectedDiscipline // Asigna la disciplina deportiva encontrada al miembro seleccionado
      });
    } else {
      setSelectedMember({});
    }
    setDisplayModal(true);
    setIsEditing(!!member); // Establece isEditing en verdadero si se proporciona un miembro
    setConfirmModalProps({
      ...confirmModalProps,
      title: isEditing ? 'Editar Miembro' : 'Agregar Miembro',
      content: null,
      buttonName: 'Guardar',
      severity: 'Primary',
      buttonAction: null,
    });
  };


  const hideMemberModal = () => {
    setSelectedMember(null);
    setDisplayModal(false);
    setErrors({}); // Limpiar los errores al cerrar el modal
    setIsEditing(false); // Establece isEditing en falso al cerrar el modal
  };

  const addMember = async (member) => {
    try {
      await MemberService.addMember(member);
      fetchMembers(); // Actualizar la lista de miembros después de agregar uno nuevo
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const deleteMember = (member) => {
    setSelectedMember(member);
    const confirmModalProps = {
      visible: true,
      title: 'Confirmar Eliminación',
      content: `¿Estás seguro de eliminar al participante: ${member.name}?`,
      buttonName: 'Sí',
      severity: 'danger',
      buttonAction: () => confirmDelete(member), // Pasa member como argumento a confirmDelete
    };
    setConfirmModalProps(confirmModalProps);
    setDisplayModal(true);
  };

  const confirmDelete = async (member) => { // Acepta member como argumento
    try {
      await MemberService.deleteMember(member.id); // Usa member.id en lugar de selectedMember.id
      setConfirmModalProps({ ...confirmModalProps, visible: false });
      fetchMembers();
      setDisplayModal(false);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };


  const handleFormSubmit = async () => {
    if (!selectedMember) return;

    // Verificar campos requeridos antes de enviar el formulario
    const { id, name, age, address, sportDiscipline } = selectedMember;
    const errors = {};
    if (!id) errors.id = 'El campo Documento es requerido.';
    if (!name) errors.name = 'El campo Nombre es requerido.';
    if (!age) errors.age = 'El campo Edad es requerido.';
    if (!address) errors.address = 'El campo Dirección es requerido.';
    if (!sportDiscipline) errors.sportDiscipline = 'Seleccione una disciplina deportiva.';

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Crear un nuevo objeto de miembro para enviar al backend
    const memberToSend = {
      id,
      name,
      age,
      address,
      sportDiscipline: {
        id: sportDiscipline // Enviar directamente el ID de la disciplina seleccionada
      }
    };

    try {
      if (isEditing) {
        const memberToUpdate = {
          id,
          name,
          age,
          address,
          sportDiscipline: {
            id: sportDiscipline.id ?? sportDiscipline 
          },
          participations: selectedMember.participations 
        };
        await MemberService.updateMember(selectedMember.id, memberToUpdate);
        fetchMembers()
      } else {
        await addMember(memberToSend); // Esperar a que se agregue el miembro
      }
      hideMemberModal(); // Ocultar el modal después de enviar el formulario
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sportDiscipline') {
      setSelectedMember(prevState => ({
        ...prevState,
        sportDiscipline: value // Asigna el valor seleccionado directamente
      }));
    } else {
      setSelectedMember(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    setErrors({ ...errors, [name]: undefined });
  };
  



  const formatDisciplineLabel = (discipline) => {
    return discipline ? `${discipline.name} - ${discipline.type}` : '';
  };


  const modalContent = (
    <form onSubmit={handleFormSubmit} className="modal-form">
      <div className="p-field">
        <span className="p-float-label">
          <InputText
            type="number"
            id="id"
            name="id"
            value={selectedMember?.id || ''}
            onChange={handleChange}
            className={errors.id ? 'p-invalid' : ''}
          />
          <label htmlFor="id">Documento</label>
        </span>
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <InputText
            type="text"
            id="name"
            name="name"
            value={selectedMember?.name || ''}
            onChange={handleChange}
            className={errors.name && 'p-invalid'}
          />
          <label htmlFor="name">Nombre</label>
        </span>
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <InputText
            type="number"
            id="age"
            name="age"
            value={selectedMember?.age || ''}
            onChange={handleChange}
            className={errors.age && 'p-invalid'}
          />
          <label htmlFor="age">Edad</label>
        </span>
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <InputText
            type="text"
            id="address"
            name="address"
            value={selectedMember?.address || ''}
            onChange={handleChange}
            className={errors.address && 'p-invalid'}
          />
          <label htmlFor="address">Dirección</label>
        </span>
      </div>
      <div className="p-field">
        <span className="p-float-label">
          <Dropdown
            id="sportDiscipline"
            name="sportDiscipline"
            value={selectedMember?.sportDiscipline?.id || null} // Aquí accedemos al ID de la disciplina deportiva
            options={sportDisciplines}
            onChange={handleChange}
            optionLabel={formatDisciplineLabel}
            optionValue="id"
            placeholder="Seleccione una disciplina deportiva"
            className={errors.sportDiscipline && 'p-invalid'}
          />
          <label htmlFor="sportDiscipline">Disciplina Deportiva</label>
        </span>
      </div>
    </form>
  );

  return (
    <div className="member-table-container">
      <h2 className="title">Miembros del Club Deportivo</h2>

      <DataTable value={members} className="p-datatable-striped">
        <Column field="id" header="Identificación" sortable></Column>
        <Column field="name" header="Nombre" sortable></Column>
        <Column field="age" header="Edad" sortable></Column>
        <Column field="address" header="Dirección" sortable></Column>
        <Column field="sportDiscipline.name" header="Disciplina" sortable></Column>
        <Column field="sportDiscipline.type" header="Tipo" sortable></Column>
        <Column
          header="Editar"
          body={(rowData) => (
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-primary"
              onClick={() => openMemberModal(rowData)}
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
              onClick={() => deleteMember(rowData)}
            />
          )}
          headerStyle={{ width: '8rem' }}
        ></Column>
      </DataTable>
      <div className="button-container">
        <Button label="Agregar Miembro" icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={() => openMemberModal(null)} />
      </div>
      <Modal
        visible={displayModal}
        onHide={hideMemberModal}
        title={confirmModalProps.title}
        content={confirmModalProps.content ?? modalContent}
        buttonName={confirmModalProps.buttonName}
        buttonAction={confirmModalProps.buttonAction ?? handleFormSubmit}
        severity={confirmModalProps.severity}
      />
    </div>
  );
};

export default MemberTable;
