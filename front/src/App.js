import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PostsFeed from "./pages/PostsFeed";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/postsfeed" element={<PostsFeed />} />
          <Route path="/profile:id" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
