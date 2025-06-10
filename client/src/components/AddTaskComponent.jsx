import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AddTaskComponent = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://e2425-wads-l4ccg5-server-setiadi.csbihub.id/service/todo"; 

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskDesc.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/add_todo`, {
        todo_name: taskTitle,
        todo_desc: taskDesc,
        todo_status: "active",
        todo_image: "https://api.dicebear.com/9.x/icons/svg?seed=" + taskTitle
      });
      
      toast.success("Task added successfully!");
      
      // Clear form
      setTaskTitle("");
      setTaskDesc("");
      
      
      window.location.reload(); 
      
    } catch (error) {
      toast.error("Failed to add task");
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-1/4 flex-col gap-2 bg-green-100 rounded-md p-4">
        <h1 className="text-green-900 font-semibold text-lg">Add Your Task</h1>
        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
          <input
            type="text"
            id="taskTitle"
            placeholder="Task Title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="p-3 w-full text-white rounded-md border-gray-100 bg-green-800 shadow-xs text-sm placeholder:text-gray-300"
          />

          <textarea
            id="taskDesc"
            cols="30"
            rows="12"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            className="p-3 rounded-md text-sm w-full text-white border-gray-100 bg-green-800 placeholder:text-gray-300 resize-none"
            placeholder="Write your task here..."
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full px-4 py-2 text-sm text-white rounded-md bg-green-600 hover:bg-green-800 transition ease-in-out"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTaskComponent;