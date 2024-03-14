import "./App.css";
import Hero from "./Hero/Hero";
import KeysSection from "./Keys/Keys";
import Navbar from "./Navbar/NavBar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <KeysSection />
    </div>
  );
}

export default App;
