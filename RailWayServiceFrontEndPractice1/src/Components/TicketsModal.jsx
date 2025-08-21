import React, { useEffect, useState } from "react";
import { api } from "../services/api";

function TicketsModal({ onClose }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // загрузка билетов
  const fetchTickets = async () => {
    try {
      const data = await api.get("api/Tickets");
      setTickets(data);
    } catch (err) {
      console.error("Ошибка загрузки билетов:", err);
    } finally {
      setLoading(false);
    }
  };

  // удаление билета
  const handleDelete = async (id) => {
    if (!window.confirm("Удалить билет?")) return;
    try {
      await api.delete(`api/Tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении билета:", err);
      alert("Не удалось удалить билет");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Мои билеты</h2>
        <button onClick={onClose} className="close-btn">X</button>

        {loading ? (
          <p>Загрузка...</p>
        ) : tickets.length === 0 ? (
          <p>У вас пока нет билетов</p>
        ) : (
          <ul>
            {tickets.map(ticket => (
              <li key={ticket.id} className="ticket-item">
                <p>🎫 Место: <b>{ticket.seatNumber}</b> | Цена: <b>{ticket.price}₴</b></p>
                <p>👤 Пользователь: <b>{ticket.userName || "—"}</b></p>
                <p>
                  🚉 Маршрут: <b>{ticket.startStation}</b> → <b>{ticket.endStation}</b>
                </p>
                <p>
                  ⏰ Отправление: {new Date(ticket.departureTime).toLocaleString()} <br />
                  🕓 Прибытие: {new Date(ticket.arrivalTime).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="btn-delete"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TicketsModal;
