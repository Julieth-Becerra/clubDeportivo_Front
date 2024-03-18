// MemberService.js

const BASE_URL = process.env.REACT_APP_API_URL; // La URL base de tu API

const MemberService = {
  getAllMembers: async () => {
    const response = await fetch(`${BASE_URL}/members`);
    return response.json();
  },

  addMember: async (member) => {
    const response = await fetch(`${BASE_URL}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });
    return response.json();
  },

  updateMember: async (id, member) => {
    const response = await fetch(`${BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });
    return response.json();
  },

  deleteMember: async (id) => {
    const response = await fetch(`${BASE_URL}/members/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

export default MemberService;
