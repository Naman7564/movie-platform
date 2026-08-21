import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MyListProvider } from './context/MyListContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';

import { HomePage } from './pages/Home/HomePage';
import { MoviesPage } from './pages/Movies/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetails/MovieDetailsPage';
import { GenresPage } from './pages/Genres/GenresPage';
import { TrendingPage } from './pages/Trending/TrendingPage';
import { PopularPage } from './pages/Popular/PopularPage';
import { MyListPage } from './pages/MyList/MyListPage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';

export function App() {
  return (
    <MyListProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/:slug" element={<MovieDetailsPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/popular" element={<PopularPage />} />
              <Route path="/my-list" element={<MyListPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </MyListProvider>
  );
}

export default App;
