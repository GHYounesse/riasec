// import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";


import RiasecLanding from './screens/LandingPage/RiasecLanding';
import RiasecGame from './screens/SwipePage/RiasecGame';


function App() {
  

  // Compute total duration when tab closes
  // useEffect(() => {
  //   const handleUnload = () => {
  //     if (!sessionRef.current) return;
  //     sessionRef.current.completed_at = new Date().toISOString();
  //     sessionRef.current.total_duration_ms =
  //       new Date().getTime() - new Date(sessionRef.current.started_at).getTime();

  //     // Send to backend reliably
  //    // navigator.sendBeacon("/api/sessions", JSON.stringify(sessionRef.current));
  //   };

  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => window.removeEventListener("beforeunload", handleUnload);
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<RiasecLanding />} />
      <Route path="/index" element={<RiasecGame />} />
    </Routes>
  );
}

export default App;