import { useState, useEffect } from "react";
import "./App.css";
import supabase from "./supabase-client";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodoList(data);
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      item_name: newTodo,
      item_isCompleted: false,
    };
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .single();

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      setTodoList((prevList) => [...prevList, data]);
      setNewTodo("");
    }
  };

  const completeTask = async (id, item_isCompleted) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ item_isCompleted: !item_isCompleted })
      .eq("id", id);

  if (error) {
    console.error("Error toggling task: ", error);
  } else {
    const updatedTodoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, item_isCompleted: !item_isCompleted } : todo
    );
    setTodoList(updatedTodoList);
  }
};

const deleteTask = async (id) => {
  const { data, error } = await supabase
    .from("TodoList")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting task: ", error);
  } else {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  }
}

  return (
    <div>
      {" "}
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="New Todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li>
            <p>{todo.item_name}</p>
            <button
              onClick={() => completeTask(todo.id, todo.item_isCompleted)}
            >
              {" "}
              {todo.item_isCompleted ? "Undo" : "Complete Task"}
            </button>
            <button onClick = {() => deleteTask(todo.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
