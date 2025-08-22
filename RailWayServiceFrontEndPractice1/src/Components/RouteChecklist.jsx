import React, { useState, useEffect } from 'react';

function RouteSelectDetailed({ onChange }) {
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [seats, setSeats] = useState([]);
  const [open, setOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const API_BASE_URL = 'https://railwayservicebackend-esgkdxebbafpfwb3.polandcentral-01.azurewebsites.net/';

  useEffect(() => {
    fetch(`${API_BASE_URL}api/route`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selected) return;

    fetch(`${API_BASE_URL}api/tickets/${selected.id}/seats`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setSeats(data))
      .catch(err => console.error(err));
  }, [selected]);

  const handleSelect = (route) => {
    setSelected(route);
    setOpen(false);
    onChange && onChange(route);
  };

  const handleSeatClick = (seat) => {
    if (seat.isTaken) return;
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  const handleBuy = async () => {
    if (!selectedSeat || !selected) {
      alert("Ошибка: не выбран маршрут или место");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/tickets`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          routeId: selected.id,
          seatNumber: selectedSeat.seatNumber,
          price: 100
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        alert("Ошибка: " + errText);
        return;
      }

      alert("Билет успешно куплен!");
      setModalOpen(false);

      // Обновляем список мест
      const newSeats = await fetch(`${API_BASE_URL}api/tickets/${selected.id}/seats`, {
        credentials: 'include'
      }).then(r => r.json());
      setSeats(newSeats);

    } catch (e) {
      console.error(e);
      alert("Ошибка при покупке билета");
    }
  };

  return (
    <div style={{ position: 'relative', width: '300px', fontFamily: 'sans-serif' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '8px' }}>
        {selected ? `${selected.startStation} — ${selected.endStation}` : 'Выберите маршрут'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, width: '100%',
          border: '1px solid #ccc', background: '#fff', zIndex: 10
        }}>
          {routes.map(route => (
            <div
              key={route.id}
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              onClick={() => handleSelect(route)}
            >
              {route.startStation} — {route.endStation}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{
          marginTop: '16px', padding: '12px', border: '1px solid #ccc',
          borderRadius: '4px', background: '#f9f9f9'
        }}>
          <h4>Маршрут: {selected.startStation} — {selected.endStation}</h4>
          <p><strong>Время отправления:</strong> {new Date(selected.departureTime).toLocaleString()}</p>
          <p><strong>Время прибытия:</strong> {new Date(selected.arrivalTime).toLocaleString()}</p>
          <p><strong>ID поезда:</strong> {selected.trainId}</p>
          {selected.train && <p><strong>Название поезда:</strong> {selected.train.name}</p>}

          <h5>Места:</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {seats.map(seat => (
              <div
                key={seat.seatNumber}
                style={{
                  width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '4px', border: '1px solid #ccc',
                  backgroundColor: seat.isTaken ? '#f44336' : '#4caf50',
                  color: '#fff', cursor: seat.isTaken ? 'not-allowed' : 'pointer'
                }}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
          <p style={{ marginTop: '8px' }}>
            <span style={{ color: '#4caf50' }}>■</span> — свободное, <span style={{ color: '#f44336' }}>■</span> — занято
          </p>
        </div>
      )}

      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '300px' }}>
            <h3>Подтверждение покупки</h3>
            <p>Маршрут: {selected.startStation} — {selected.endStation}</p>
            <p>Место: {selectedSeat?.seatNumber}</p>
            <p>Цена: 100 $</p>
            <button onClick={handleBuy} style={{ marginRight: '10px' }}>Купить</button>
            <button onClick={() => setModalOpen(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteSelectDetailed;
