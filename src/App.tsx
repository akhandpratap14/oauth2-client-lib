import { Route, Routes } from "react-router";
import Login from "./app/pages/auth/login";
import Home from "./app/pages/home";
import CallbackPage from "./app/components/oAuthCallback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
