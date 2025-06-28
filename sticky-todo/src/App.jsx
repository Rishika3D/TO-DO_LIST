import React, { useState } from 'react';

const pastelColors = [
  'bg-pink-100 border-pink-200',
  'bg-yellow-200 border-yellow-300',
  'bg-green-100 border-green-200',
  'bg-blue-100 border-blue-200',
  'bg-purple-100 border-purple-200',
];

const Todo = () => {
  const [msg, setMsg] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [doneSet, setDoneSet] = useState(new Set());

  const handleAddOrUpdate = () => {
    if (msg.trim() === "") return;

    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex].text = msg;
      setTodos(updated);
      setEditIndex(null);
    } else {
      const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      setTodos([...todos, { text: msg, color }]);
    }
    setMsg("");
  };

  const handleDelete = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
    const newDoneSet = new Set(doneSet);
    newDoneSet.delete(idx);
    setDoneSet(newDoneSet);
    if (editIndex === idx) {
      setEditIndex(null);
      setMsg("");
    }
  };

  const handleDone = (idx) => {
    const newDoneSet = new Set(doneSet);
    newDoneSet.add(idx);
    setDoneSet(newDoneSet);
  };

  const handleEdit = (idx) => {
    setMsg(todos[idx].text);
    setEditIndex(idx);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100 flex flex-col items-center p-6 font-sourgummy">
      <h1 className="text-5xl font-bold mb-8 text-yellow-800 drop-shadow">
        To-Do List
      </h1>

      <div className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          value={msg}
          placeholder="What's poppin' today?"
          onChange={(e) => setMsg(e.target.value)}
          className="flex-grow p-3 rounded-xl border-2 border-yellow-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300 transition duration-200 ease-in-out"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-5 rounded-xl shadow hover:scale-105 active:scale-95 transition-transform"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`rounded-xl p-4 border shadow-lg transform hover:scale-[1.03] hover:shadow-xl transition-all duration-300 ease-out flex flex-col ${todo.color}`}
          >
            <span
              className={`text-lg mb-3 transition-all ${
                doneSet.has(index) ? 'line-through opacity-50' : ''
              }`}
            >
              {todo.text}
            </span>

            <div className="flex justify-end gap-3 flex-wrap text-sm">
              <button
                onClick={() => handleEdit(index)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                ✏️ Edit
              </button>

              {!doneSet.has(index) && (
                <button
                  onClick={() => handleDone(index)}
                  className="text-green-600 hover:text-green-800 transition"
                >
                  ✅ Done
                </button>
              )}

              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
