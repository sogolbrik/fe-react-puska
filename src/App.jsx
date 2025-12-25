// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import BukuListPage from './features/buku/pages/BukuListPage';
// import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Semua route admin dibungkus layout */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="buku" element={<BukuListPage />} />
                {/* Tambahkan route lain di sini */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </AdminLayout>
          }
        />

        {/* Redirect root ke /admin */}
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}