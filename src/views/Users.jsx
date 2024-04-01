import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
// import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Users.css";
import useApi from "../utils/http";

const Users = () => {
  const toast = useRef(null);
  // const navigate = useNavigate();
  const api = useApi();
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    setUserId(parseInt(localStorage.getItem("user_id")));
    getUsers();
    return () => {};
  }, []);

  async function getUsers() {
    const { data } = await api.get("/users.php");
    setUsers(data);
  }

  async function createUser(e) {
    e.preventDefault();
    try {
      const body = {
        username,
      };

      const { data } = await api.post("/users.php", body);
      toast.current.show({
        severity: "success",
        detail: data.message,
      });
      getUsers();
    } catch (error) {
      toast.current.show({
        severity: "error",
        detail: error.message,
      });
    }
  }

  function useUser(data) {
    setUserId(data.user_id);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("username", data.username);
    window.dispatchEvent(new Event("setUserId"));
    // navigate("/tasks");
  }

  function actions(data) {
    return (
      <div className="user-buttons">
        <Button onClick={() => useUser(data)}>Use this user</Button>
      </div>
    );
  }

  function usernameTemplate(data) {
    return (
      <p>
        {data.username}
        {data.user_id === userId ? (
          <i className="current-user pi pi-star-fill"></i>
        ) : null}
      </p>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <form className="users-form" onSubmit={createUser}>
        <InputText
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit">Create</Button>
      </form>
      <DataTable value={users}>
        <Column header="Username" body={usernameTemplate}></Column>
        <Column body={actions}></Column>
      </DataTable>
    </>
  );
};

export default Users;
