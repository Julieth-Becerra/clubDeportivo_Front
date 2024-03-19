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
      try {
        const response = await fetch(`${BASE_URL}/participations/${id}`, {
          method: "DELETE",
        });
    
        // Verificar el estado de la respuesta
        if (response.ok) {
          return { success: true, message: "Participación eliminada correctamente." };
        } else {
          const errorData = await response.json();
          return { success: false, message: errorData.message || "Ocurrió un error al eliminar la participación." };
        }
      } catch (error) {
        console.error('Error deleting participation:', error);
        return { success: false, message: "Ocurrió un error al eliminar la participación." };
      }
    },
    
}

export default ParticipationService;