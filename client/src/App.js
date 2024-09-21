import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollReveal from 'scrollreveal';
import Navbar from './components/Navbar'; 
import Dashboard from './pages/Dashboard';    
import Landing from './pages/Landing'; 
import Footer from './components/Footer';
import Segregation from './pages/segregation';
import Generator from './pages/generator';
import Auth from "./pages/Auth";  
import ServiceHome from './pages/ServiceHome'; 
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPath = location.pathname.includes("/auth");

  return (
    <Routes>
      <Route exact path="/auth/signin" element={<Auth />} />
      <Route exact path="/auth/signup" element={<Auth />} />
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/" element={<Landing />} />
      <Route exact path="/home" element={<Landing />} />
      <Route exact path="/segregation" element={<Segregation />} />
      <Route exact path="/generator" element={<Generator />} />
      <Route exact path="/services/*" element={<ServiceHome />} />
    </Routes>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // useEffect(() => {
  //   const sr = ScrollReveal({
  //     origin: "top",
  //     distance: "80px",
  //     duration: 2000,
  //     reset: false
  //   });

  //   sr.reveal(".element", { interval: 200 });
  //   sr.reveal(".featured-text-card", {});
  //   sr.reveal(".featured-name", { delay: 100 });
  //   sr.reveal(".featured-text-info", { delay: 200 });
  //   sr.reveal(".featured-text-btn", { delay: 200 });
  //   sr.reveal(".social_icons", { delay: 200 });
  //   sr.reveal(".featured-image", { delay: 300 });
  //   sr.reveal(".project-box", { interval: 200 });
  //   sr.reveal(".top-header", {});

  //   const srLeft = ScrollReveal({
  //     origin: "left",
  //     distance: "80px",
  //     duration: 2000,
  //     reset: false
  //   });

  //   srLeft.reveal(".about-info", { delay: 100 });
  //   srLeft.reveal(".contact-info", { delay: 100 });

  //   const srRight = ScrollReveal({
  //     origin: "right",
  //     distance: "80px",
  //     duration: 2000,
  //     reset: false
  //   });

  //   srRight.reveal(".skills-box", { delay: 100 });
  //   srRight.reveal(".form-control", { delay: 100 });

  //   const sections = document.querySelectorAll("section[id]");
  //   function scrollActive() {
  //     const scrollY = window.scrollY;
  //     sections.forEach((current) => {
  //       const sectionHeight = current.offsetHeight;
  //       const sectionTop = current.offsetTop - 50;
  //       const sectionId = current.getAttribute("id");
  //       if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
  //         document.querySelector(`.nav-menu a[href*=${sectionId}]`).classList.add("active-link");
  //       } else {
  //         document.querySelector(`.nav-menu a[href*=${sectionId}]`).classList.remove("active-link");
  //       }
  //     });
  //   }
  //   window.addEventListener("scroll", scrollActive);

  //   return () => window.removeEventListener("scroll", scrollActive);
  // }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <AppContent />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
