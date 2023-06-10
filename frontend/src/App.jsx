import { Routes, Route } from "react-router-dom";

import "./App.css";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";

import ProtectedOrder from "./components/ProtectedOrder";
import ProtectedCartSummary from "./components/ProtectedCartSummary";
import SubmitOrder from "./components/SubmitOrder";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/users/signup" element={<SignUp />} />
          <Route path="/users/login" element={<LogIn />} />
          <Route path="/order" element={<ProtectedOrder />} />
          <Route path="/users/cart" element={<ProtectedCartSummary/>} />
          <Route path="/users/submited-order" element={<SubmitOrder/>} />
        </Routes>
    </div>
  );
}

export default App;