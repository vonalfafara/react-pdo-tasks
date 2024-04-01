import Users from "./views/Users";
import Tasks from "./views/Tasks";

const routes = [
  {
    name: "Users",
    path: "/users",
    element: <Users />,
  },
  {
    name: "Tasks",
    path: "/tasks",
    element: <Tasks />,
  },
];

export default routes;
