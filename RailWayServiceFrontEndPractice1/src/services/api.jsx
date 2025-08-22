const API_BASE_URL = 'https://railwayservicebackend-esgkdxebbafpfwb3.polandcentral-01.azurewebsites.net/';

export const api = {
  get: (url) => fetch(`${API_BASE_URL}${url}`, { 
    credentials: 'include' 
  }).then(res => res.json()),

post: async (url, data) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  const json = await res.json().catch(() => null); // если тело пустое
  if (!res.ok) {
    throw json || { message: `Ошибка ${res.status}` };
  }
  return json;
},

  delete: async (url) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (res.status === 204) return true; // No Content — всё ок
    const json = await res.json().catch(() => null);
    if (!res.ok) throw json || { message: `Ошибка ${res.status}` };
    return json;
  }

};