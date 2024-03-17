import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MemberService from '../../services/MemberService';
import './styles.css';

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const response = await MemberService.getAllMembers();
    setMembers(response.data);
  };

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setDisplayModal(true);
  };

  const hideMemberModal = () => {
    setSelectedMember(null);
    setDisplayModal(false);
  };

  const deleteMember = (member) => {
    // Lógica para eliminar un miembro
  };

  return (
    <div className="member-table-container">
      <h2 className="title">Miembros del Club Deportivo</h2>
      <DataTable value={members} className="p-datatable-striped">
        <Column field="name" header="Nombre" sortable></Column>
        <Column field="age" header="Edad" sortable></Column>
        <Column field="address" header="Dirección" sortable></Column>
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
      <Dialog visible={displayModal} onHide={hideMemberModal}>
        {/* Contenido del modal para agregar/editar miembros */}
        <h2>{selectedMember ? 'Editar Miembro' : 'Agregar Miembro'}</h2>
        {/* Aquí puedes colocar los campos del formulario para agregar/editar miembros */}
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default MemberTable;
