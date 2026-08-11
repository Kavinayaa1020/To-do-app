import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState("");

  //get all todos
  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const data = await response.json();
      setTodos(data);
    }
    catch (error) {
      console.error(error);
    }
  };

  //add todo
  const addTodo = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      });

      const newTodo = await response.json();

      setTodos([...todos, newTodo]);
      setTitle("");
      setDescription("");
    }
    catch (error) {
      console.error(error);
    }
  };

  //edit todo
  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo._id);
  };

  //update todo
  const updateTodo = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/todos/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: title,
            description: description
          })
        }
      );

      const updatedTodo = await response.json();

      setTodos(
        todos.map((todo) =>
          todo._id === editingId ? updatedTodo : todo
        )
      );

      setTitle("");
      setDescription("");
      setEditingId("");
    }
    catch (error) {
      console.error(error);
    }
  };

  //delete todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE"
      });

      setTodos(todos.filter((todo) => todo._id !== id));
    }
    catch (error) {
      console.error(error);
    }
  };

  //cancel edit
  const cancelEdit = () => {
    setTitle("");
    setDescription("");
    setEditingId("");
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="app">

      <h1>Todo App</h1>

      <div className="task-form">
        <h2>{editingId ? "Edit Task" : "Add Task"}</h2>

        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {editingId ? (
          <div className="form-buttons">
            <button className="update-btn" onClick={updateTodo}>
              Update Task
            </button>

            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="submit-btn" onClick={addTodo}>
            Submit
          </button>
        )}
      </div>

      <div className="tasks">
        <h2>Tasks</h2>

        {todos.length === 0 ? (
          <p className="no-tasks">No tasks added yet.</p>
        ) : (
          todos.map((todo) => (
            <div className="task-card" key={todo._id}>

              <div className="task-content">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
              </div>

              <div className="task-buttons">
                <button
                  className="edit-btn"
                  onClick={() => editTodo(todo)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;