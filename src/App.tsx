import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskAdd from "./components/TaskAdd";
import Header from "./components/Header";
import { CoreService } from "./services/CoreService";

const App: React.FC = () => {
  if (!CoreService.getTask()) {
    CoreService.setTask(JSON.stringify([]));
  }
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/list" element={<TaskList />} />
          <Route path="/add" element={<TaskAdd />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
