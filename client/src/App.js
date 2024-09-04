import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import VideoCall from "./components/VideoCall";

// const router = createBrowserRouter(createRoutesFromElements());

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="chats" element={<ChatPage />}>
          <Route path="video-call/:roomId" element={<VideoCall />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
