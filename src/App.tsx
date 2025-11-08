import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { LayoutHC } from './components/layoutHC'; 

import HomeHC from './pages/HomeHC'; 
import AboutHC from './pages/AboutHC'; 
import FaleConosco from './pages/FaleConosco'; 
import AgendamentoOnline from './pages/AgendamentoOnline'; 
import AcessoPaciente from './pages/AcessoPaciente'; 
import IntegrantesHC from './pages/IntegrantesHC'; 
import SuporteVirtual from './pages/SuporteVirtual'; 
import NotFound from './pages/NotFound'; 
import CadastroPaciente from './pages/CadastroPaciente';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPaciente from './pages/DashboardPaciente';
import AgendamentoConsulta from './pages/AgendamentoConsulta';
import EditarConsulta from './pages/EditarConsulta';
import Receita from './pages/Receita';


const AppHC: React.FC = () => (
  <Router>
    {}
    <LayoutHC> 
      <Routes>
        
        {}
        <Route path="/" element={<HomeHC />} />
        <Route path="/about" element={<AboutHC />} />
        <Route path="/integrantes" element={<IntegrantesHC />} /> {}
        
        {}
        <Route path="/agendamento" element={<AgendamentoOnline />} />
        <Route path="/fale-conosco" element={<FaleConosco />} />
        <Route path="/acesso-paciente" element={<AcessoPaciente />} />
        <Route path="/cadastro" element={<CadastroPaciente />} />
        {}
        <Route
          path="/dashboard-paciente"
          element={
            <ProtectedRoute>
              <DashboardPaciente />
            </ProtectedRoute>
          }
        />
        <Route path="/agendamento-consulta" element={<AgendamentoConsulta />} />
        {}
        <Route path="/editar-consulta" element={<EditarConsulta />} />
        <Route path="/receita" element={<Receita/>} />


        <Route path="/suporte-virtual" element={<SuporteVirtual />} /> {}

        {}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutHC> 
  </Router>
);

export default AppHC;