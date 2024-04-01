import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useState, useEffect, useRef } from "react";
import useApi from "../utils/http";
import "./Tasks.css";

const Tasks = () => {
  const api = useApi();
  const toast = useRef(null);
  const [userId, setUserId] = useState(
    parseInt(localStorage.getItem("user_id"))
  );
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [showTask, setShowTask] = useState(false);

  useEffect(() => {
    getTasks();
    return () => {};
  }, []);

  async function getTasks() {
    const { data } = await api.get(`/tasks.php?user_id=${userId}`);
    setTasks(data);
  }

  async function createTask(e) {
    e.preventDefault();

    try {
      const body = {
        task_title: title,
        task_description: description,
        user_id: userId,
      };

      const { data } = await api.post("/tasks.php", body);
      toast.current.show({
        severity: "success",
        detail: data.message,
      });
      getTasks();
    } catch (error) {
      toast.current.show({
        severity: "error",
        detail: error.message,
      });
    }
  }

  function handleSelectTask(data) {
    setTask(data);
    setShowTask(true);
  }

  function actions(data) {
    return (
      <div className="task-buttons">
        <Button onClick={() => handleSelectTask(data)}>View Details</Button>
      </div>
    );
  }

  function taskStatusTemplate(data) {
    let severity;

    if (data.task_status === "Not Started") severity = "danger";
    else if (data.task_status === "Ongoing") severity = "warning";
    else severity = "success";

    return <Tag severity={severity} value={data.task_status}></Tag>;
  }

  return (
    <>
      <Toast ref={toast} />
      <form className="task-form" onSubmit={createTask}>
        <InputText
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputTextarea
          autoResize
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          cols={30}
        />
        <div className="task-form-buttons">
          <Button type="submit">Create Task</Button>
        </div>
      </form>
      <DataTable value={tasks}>
        <Column header="Task" field="task_title"></Column>
        <Column header="Status" body={taskStatusTemplate}></Column>
        <Column body={actions}></Column>
      </DataTable>
      <Dialog
        dismissableMask
        draggable={false}
        header={task.task_title}
        visible={showTask}
        style={{ width: "300px" }}
        onHide={() => setShowTask(false)}
      >
        <p dangerouslySetInnerHTML={{ __html: task.task_description }}></p>
        {taskStatusTemplate(task)}
      </Dialog>
    </>
  );
};

export default Tasks;
