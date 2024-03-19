import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Sidebar from './components/navBar/navBar';
import Member from './components/member/Member';
import Banner from './components/banner/banner';
import SportDicipline from './components/dicipline/sportDicipline';
import Event from './components/event/event';
import ResultsParticipation from './components/results/resultsParticipation';

function App() {
  return (
    <div className="App">
      <PrimeReactProvider>
        <Router>
          <Sidebar />
          <div className="content">
            <Banner />
            <Routes>
              <Route path="/afiliados" element={<Member />} />
              <Route path="/disciplinas" element={<SportDicipline />} />
              <Route path='/eventos' element={<Event />} />
              <Route path='/resultados' element={<ResultsParticipation />}/>
            </Routes>
          </div>
        </Router>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
