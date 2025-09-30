import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import MonthEvent from "./components/MonthEvent"
import News from "./components/News"


function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <News />
      <MonthEvent />

      <Footer />
    </div>
  )
}

export default App