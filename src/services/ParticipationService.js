const BASE_URL = process.env.REACT_APP_API_URL;

const ParticipationService = {
    getAllParticipations: async () => {
        const response = await fetch(`${BASE_URL}/participations`);
        return response.json();
    },

    addParticipation: async (participation) => {
        const response = await fetch(`${BASE_URL}/participations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(participation),
          });
          return response.json();
    },

    updateParticipation: async (id, participation) => {
        const response = await fetch(`${BASE_URL}/participations/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(participation),
          });
          return response.json();
    },

    deleteParticipation: async (id) => {
        const response = await fetch(`${BASE_URL}/participations/${id}`, {
            method: "DELETE",
          });
          return response.json();
    }
}

export default ParticipationService;