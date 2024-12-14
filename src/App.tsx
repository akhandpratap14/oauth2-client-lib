import { Route, Routes } from "react-router-dom";
import Login from "./app/pages/auth/login";
import Home from "./app/pages/home";
import CallbackPage from "./app/components/oAuthCallback";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
