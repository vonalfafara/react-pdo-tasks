import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useState, useEffect, useRef } from "react";
import useApi from "../utils/http";
import "./Tasks.css";

const Tasks = () => {
  const api = useApi();
  const toast = useRef(null);
  const [userId, setUserId] = useState(
    parseInt(localStorage.getItem("user_id"))
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [showTask, setShowTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState();
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

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
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.current.show({
        severity: "error",
        detail: error.message,
      });
    }
  }

  async function updateTask(e) {
    e.preventDefault();

    try {
      const body = {
        task_title: editTitle,
        task_description: editDescription,
        task_status: editStatus,
      };

      const { data } = await api.put(`/tasks.php?task_id=${editTaskId}`, body);
      toast.current.show({
        severity: "success",
        detail: data.message,
      });
      setShowEditTask(false);
      getTasks();
      setEditTitle("");
      setEditDescription("");
      setEditStatus("");
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

  function handleEditTask(data) {
    setEditTaskId(data.task_id);
    setEditTitle(data.task_title);
    setEditDescription(data.task_description);
    setEditStatus(data.task_status);
    setShowEditTask(true);
  }

  async function accept(id) {
    try {
      const { data } = await api.delete(`/tasks.php?task_id=${id}`);
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

  function handleDeleteTask(data) {
    confirmDialog({
      message: "Do you want to delete this task?",
      header: "Delete Task",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      accept: () => accept(data.task_id),
    });
  }

  function actions(data) {
    return (
      <div className="task-buttons">
        <Button icon="pi pi-search" onClick={() => handleSelectTask(data)} />
        <Button
          icon="pi pi-pencil"
          severity="warning"
          onClick={() => handleEditTask(data)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => handleDeleteTask(data)}
        />
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
      <ConfirmDialog draggable={false} />
      <form className="task-form" onSubmit={createTask}>
        <InputText
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputTextarea
          autoResize
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          cols={30}
        />
        <div className="task-form-buttons">
          <Button type="submit" disabled={!title || !description}>
            Create Task
          </Button>
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
      <Dialog
        dismissableMask
        draggable={false}
        header="Edit Task"
        visible={showEditTask}
        style={{ width: "600px" }}
        onHide={() => setShowEditTask(false)}
      >
        <form className="task-form" onSubmit={updateTask}>
          <InputText
            value={editTitle}
            placeholder="Title"
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <InputTextarea
            autoResize
            value={editDescription}
            placeholder="Description"
            onChange={(e) => setEditDescription(e.target.value)}
            rows={5}
            cols={30}
          />
          <p>Status</p>
          <div className="status">
            <RadioButton
              inputId="not-started"
              name="status"
              value="Not Started"
              onChange={(e) => setEditStatus(e.target.value)}
              checked={editStatus === "Not Started"}
            />
            <label htmlFor="not-started">Not Started</label>
          </div>
          <div className="status">
            <RadioButton
              inputId="ongoing"
              name="status"
              value="Ongoing"
              onChange={(e) => setEditStatus(e.target.value)}
              checked={editStatus === "Ongoing"}
            />
            <label htmlFor="ongoing">Ongoing</label>
          </div>
          <div className="status">
            <RadioButton
              inputId="completed"
              name="status"
              value="Completed"
              onChange={(e) => setEditStatus(e.target.value)}
              checked={editStatus === "Completed"}
            />
            <label htmlFor="completed">Completed</label>
          </div>
          <div className="task-form-buttons">
            <Button type="submit" disabled={!editTitle || !editDescription}>
              Update Task
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Tasks;
