import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ConsultingPage from './pages/ConsultingPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import RequestConsultationPage from './pages/RequestConsultationPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/request-consultation" element={<RequestConsultationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
