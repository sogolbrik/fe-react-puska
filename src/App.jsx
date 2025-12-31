import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import IndexBuku from './features/buku/pages/IndexBuku';
import IndexKategori from './features/kategori/pages/IndexKategori';
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
                <Route path="buku" element={<IndexBuku />} />
                <Route path="kategori" element={<IndexKategori />} />
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </AdminLayout>
          }
        />

        {/* Redirect root ke /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}