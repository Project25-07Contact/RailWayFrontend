import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './Components/LoginModal';
import RegisterModal from './Components/RegisterModal';
import TicketsModal from './Components/TicketsModal'; // ← новая модалка

import './App.css';
import RouteChecklist from './Components/RouteChecklist';

function AppContent() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showTickets, setShowTickets] = useState(false); // ← новое состояние

  return (
    <div className="app">
      <header className="header">
        <div className="auth-buttons">
          {user ? (
            <>
              <span>Привет, {user.username}</span>
              <button onClick={() => setShowTickets(true)} className="btn">Мои билеты</button> {/* новая кнопка */}
              <button onClick={logout} className="btn">Выйти</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="btn">Войти</button>
              <button onClick={() => setShowRegister(true)} className="btn">Регистрация</button>
            </>
          )}
        </div>
      </header>

      <main className="main">
        <RouteChecklist />
      </main>

      {/* модалки */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showTickets && <TicketsModal onClose={() => setShowTickets(false)} />} {/* модалка с билетами */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
