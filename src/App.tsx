import { Routes, Route } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Hero from "./layouts/Hero";
import MonthEvent from "./layouts/MonthEvent";
import News from "./layouts/News";
import NewsPage from "./pages/NewsPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <News />       {/* seulement les 3 derniers articles */}
              <MonthEvent />
            </>
          }
        />

        {/* Page des actualités complètes */}
        <Route path="/news" element={<NewsPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
