import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import MemberService from '../services/MemberService'; // Importa el servicio de miembros

const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    fetchMembers(); // Llama a la función para obtener la lista de miembros al cargar el componente
  }, []);

  const fetchMembers = async () => {
    const response = await MemberService.getAllMembers(); // Llama al método del servicio para obtener todos los miembros
    setMembers(response.data); // Actualiza el estado con la lista de miembros obtenida
  };

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setDisplayModal(true); // Muestra el modal de agregar/editar miembros
  };

  const hideMemberModal = () => {
    setSelectedMember(null);
    setDisplayModal(false); // Oculta el modal de agregar/editar miembros
  };

  const renderMemberTable = () => {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.age}</td>
                <td>{member.address}</td>
                <td>
                  <Button label="Edit" onClick={() => openMemberModal(member)} />
                  <Button label="Delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button label="Add Member" onClick={() => openMemberModal(null)} />
      </div>
    );
  };

  return (
    <div>
      {renderMemberTable()}
      <Dialog visible={displayModal} onHide={hideMemberModal}>
        {/* Contenido del modal para agregar/editar miembros */}
        <h2>{selectedMember ? 'Edit Member' : 'Add Member'}</h2>
        {/* Aquí puedes colocar los campos del formulario para agregar/editar miembros */}
      </Dialog>
    </div>
  );
};

export default MemberTable;
