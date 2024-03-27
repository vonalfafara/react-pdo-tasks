import { Button } from "primereact/button";
import { useEffect } from "react";
import useApi from "./utils/http";

const App = () => {
  const api = useApi();

  useEffect(() => {
    getTasks();
    return () => {};
  }, []);

  async function getTasks() {
    const data = await api.get("/users.php");
    console.log(data);
  }
  return (
    <div className="card flex justify-content-center">
      <Button label="Check" icon="pi pi-check" />
    </div>
  );
};

export default App;
