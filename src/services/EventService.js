const BASE_URL = process.env.REACT_APP_API_URL;

const EventService = {
  getAllEvents: async () => {
    const response = await fetch(`${BASE_URL}/events`);
    return response.json();
  },

  addEvent: async (event) => {
    const response = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    return response.json();
  },

  updateEvent: async (id, event) => {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    return response.json();
  },

  deleteEvent: async (id) => {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
  getEvent: async (id) => {
    const response = await fetch(`${BASE_URL}/events/${id}`);
    return response.json();
  },
};

export default EventService;
