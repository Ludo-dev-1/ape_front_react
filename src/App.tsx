import { Routes, Route } from "react-router-dom";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Hero from "./layouts/Hero";
import MonthEvent from "./layouts/MonthEvent";
import News from "./layouts/News";
import NewsPage from "./pages/NewsPage";
import ArticlePage from "./pages/ArticlePage";
import EditArticlePage from "./pages/EditArticlePage";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";
import EditEventPage from "./pages/EditEventPage";
import LoginPage from "./pages/LoginPage";
import ShopPage from "./pages/shopPage";
import CartPage from "./pages/CartePage";
import RegisterForm from "./components/RegisterForm";
import BackofficeClient from "./pages/BackofficeClient";
import CreateSaleForm from "./components/CreateSaleForm";
import Panier from "./pages/Panier";

function App() {
  return (
    <>

      <section className="bg-slate-950 ">
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
          {/* Page d'inscription */}
          <Route path="/register" element={<RegisterForm />} />

          {/* Page de connexion */}
          <Route path="/login" element={<LoginPage />} />

          {/** Page du backoffice */}
          <Route path="/backoffice" element={<BackofficeClient />} />

          {/* Page des actualités complètes */}
          <Route path="/news" element={<NewsPage />} />

          {/* Article individuel */}
          <Route path="/news/:id" element={<ArticlePage />} />

          {/* Modifier un article */}
          <Route path="/news/edit/:id" element={<EditArticlePage />} />

          {/* Page des événements */}
          <Route path="/events" element={<EventsPage />} />

          {/* Evenement individuel */}
          <Route path="/events/:id" element={<EventPage />} />

          {/* Modifier un événement */}
          <Route path="/events/edit/:id" element={<EditEventPage />} />

          {/* Page de la boutique */}
          <Route path="/boutique" element={<ShopPage />} />

          {/*Page produit individuel */}
          <Route path="/cart/:saleId" element={<CartPage />} />

          {/* Page création de vente */}
          <Route path="/admin/create-sale" element={<CreateSaleForm />} />

          {/* Page panier*/}
          <Route path="/panier" element={<Panier />} />

        </Routes>

        <Footer />
      </section>

    </>
  );
}

export default App;
