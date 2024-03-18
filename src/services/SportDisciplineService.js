const BASE_URL = process.env.REACT_APP_API_URL;

const SportDisciplineServise = {

    getAllMembers: async () => {
        const response = await fetch(`${BASE_URL}/sportDisciplines`);
        return response.json();
    },

    addSportDiscipline: async (sportDiscipline) => {
        const response = await fetch(`${BASE_URL}/sportDisciplines`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sportDiscipline),
          });
          return response.json();
    },

    updateSportDiscipline: async (id, sportDiscipline) => {
        const response = await fetch(`${BASE_URL}/sportDisciplines/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sportDiscipline),
          });
          return response.json();
    },

    deleteSporDiscipline: async (id) => {
        const response = await fetch(`${BASE_URL}/sportDisciplines/${id}`, {
            method: 'DELETE',
          });
          return response.json();
    },
}

export default SportDisciplineServise;