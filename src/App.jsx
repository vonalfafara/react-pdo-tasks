import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "./App.css";
import routes from "./routes";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState();

  useEffect(() => {
    setUserId(localStorage.getItem("user_id"));

    window.addEventListener("setUserId", () => {
      console.log("Event setUserId is fired");
      setUserId(localStorage.getItem("user_id"));
    });

    return () => {
      window.removeEventListener("setUserId", () => {});
    };
  }, []);

  function handleChangePage(path) {
    navigate(path);
  }
  return (
    <div className="container">
      <Card title="Task Manager">
        <div className="buttons">
          {routes.map((route, index) => {
            return (
              <Button
                key={index}
                link={location.pathname !== route.path}
                onClick={() => handleChangePage(route.path)}
                disabled={route.path === "/tasks" && !userId}
              >
                {route.name}
              </Button>
            );
          })}
        </div>
        <Routes>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                element={route.element}
                exact
              />
            );
          })}
        </Routes>
      </Card>
    </div>
  );
};

export default App;
