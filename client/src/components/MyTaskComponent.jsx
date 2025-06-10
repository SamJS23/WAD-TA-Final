import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const MyTaskComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

 
  const API_BASE_URL = "https://e2425-wads-l4ccg5-server-setiadi.csbihub.id/service/todo"; 

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get_all`);
      
      const mappedTasks = response.data.map(task => ({
        id: task._id,
        title: task.todo_name,
        description: task.todo_desc,
        status: task.todo_status,
        image: task.todo_image
      }));
      
      setTasks(mappedTasks);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    document.getElementById("update-modal").showModal();
  };

  const handleUpdateTask = async () => {
    if (!updatedTitle.trim() || !updatedDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.patch(`${API_BASE_URL}/update_todo/${selectedTask.id}`, {
        todo_name: updatedTitle,
        todo_desc: updatedDescription,
        todo_status: selectedTask.status,
        todo_image: selectedTask.image
      });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, title: updatedTitle, description: updatedDescription }
          : task
      ));

      toast.success("Task updated successfully!");
      document.getElementById("update-modal").close();
      setSelectedTask(null);
      setUpdatedTitle("");
      setUpdatedDescription("");
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/delete_todo/${taskId}`);

      // Remove from local state
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      {loading && (
        <div className="text-center">Loading tasks...</div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center text-gray-500">
          No tasks available.
        </div>
      )}

      {!loading &&
        tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  className="text-blue-600 hover:text-blue-800 p-2"
                  onClick={() => handleEdit(task)}
                >
                  <FaRegEdit />
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800 p-2"
                  onClick={() => handleDelete(task.id)}
                >
                  <MdDeleteOutline />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* Modal Popup for Update Task (DaisyUI component) */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Task</h3>
          
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Description
            </label>
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          <div className="modal-action">
            <button
              className="btn bg-green-600 text-white hover:bg-green-700"
              onClick={handleUpdateTask}
            >
              Save Changes
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("update-modal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyTaskComponent;
