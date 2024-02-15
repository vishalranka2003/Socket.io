import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import MainForm from "./components/MainForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<MainForm />} />
        <Route path="/chat/:roomName" element={<ChatRoom />} />
        <Route path="*" element={<h1>404 Not Found!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
