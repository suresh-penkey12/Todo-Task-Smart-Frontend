// import React, { useState, useEffect } from 'react';
// import { taskService } from '../services/taskService';
// import { Plus, Edit, Trash2, CheckCircle, Calendar, Tag } from 'lucide-react';
// import toast from 'react-hot-toast';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const Tasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [filter, setFilter] = useState('all');

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     dueDate: '',
//   });

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const fetchedTasks = await taskService.getTasks();
//       setTasks(fetchedTasks);
//     } catch (error) {
//       toast.error('Failed to fetch tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       if (editingTask) {
//         await taskService.updateTask(editingTask._id, formData);
//         toast.success('Task updated successfully');
//       } else {
//         await taskService.createTask(formData);
//         toast.success('Task created successfully');
//       }
      
//       setShowForm(false);
//       setEditingTask(null);
//       resetForm();
//       fetchTasks();
//     } catch (error) {
//       toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTask(task);
//     setFormData({
//       title: task.title,
//       description: task.description || '',
//       category: task.category,
//       dueDate: task.dueDate.split('T')[0],
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (taskId) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         await taskService.deleteTask(taskId);
//         toast.success('Task deleted successfully');
//         fetchTasks();
//       } catch (error) {
//         toast.error('Failed to delete task');
//       }
//     }
//   };

//   const handleComplete = async (taskId) => {
//     try {
//       await taskService.markTaskComplete(taskId);
//       toast.success('Task marked as completed');
//       fetchTasks();
//     } catch (error) {
//       toast.error('Failed to mark task as completed');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       category: '',
//       dueDate: '',
//     });
//   };

//   const filteredTasks = tasks.filter(task => {
//     if (filter === 'all') return true;
//     return task.status === filter;
//   });


//   // --- Export Handlers ---
//   const exportToCSV = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredTasks);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
//     XLSX.writeFile(wb, 'tasks.csv');
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredTasks);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
//     XLSX.writeFile(wb, 'tasks.xlsx');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     const columns = [
//       { header: 'Title', dataKey: 'title' },
//       { header: 'Description', dataKey: 'description' },
//       { header: 'Category', dataKey: 'category' },
//       { header: 'Due Date', dataKey: 'dueDate' },
//       { header: 'Status', dataKey: 'status' },
//     ];
//     const rows = filteredTasks.map(task => ({
//       title: task.title,
//       description: task.description,
//       category: task.category,
//       dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
//       status: task.status,
//     }));
//     autoTable(doc, { columns, body: rows });
//     doc.save('tasks.pdf');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Download Buttons */}
//       <div className="flex gap-2 justify-end">
//         <button onClick={exportToCSV} className="btn-secondary">Download CSV</button>
//         <button onClick={exportToExcel} className="btn-secondary">Download Excel</button>
//         <button onClick={exportToPDF} className="btn-secondary">Download PDF</button>
//       </div>

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-gray-600">Manage your tasks and stay organized</p>
//         </div>
//         <button
//           onClick={() => setShowForm(true)}
//           className="btn-primary flex items-center gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           New Task
//         </button>
//       </div>

//       {/* Filter */}
//       <div className="flex space-x-2">
//         <button
//           onClick={() => setFilter('all')}
//           className={`px-4 py-2 rounded-lg text-sm font-medium ${
//             filter === 'all'
//               ? 'bg-blue-100 text-blue-700'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           All ({tasks.length})
//         </button>
//         <button
//           onClick={() => setFilter('pending')}
//           className={`px-4 py-2 rounded-lg text-sm font-medium ${
//             filter === 'pending'
//               ? 'bg-blue-100 text-blue-700'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           Pending ({tasks.filter(t => t.status === 'pending').length})
//         </button>
//         <button
//           onClick={() => setFilter('completed')}
//           className={`px-4 py-2 rounded-lg text-sm font-medium ${
//             filter === 'completed'
//               ? 'bg-blue-100 text-blue-700'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           Completed ({tasks.filter(t => t.status === 'completed').length})
//         </button>
//       </div>

//       {/* Task Form */}
//       {showForm && (
//         <div className="card">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             {editingTask ? 'Edit Task' : 'Create New Task'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 required
//                 className="input-field"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 className="input-field"
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="input-field"
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Due Date
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   className="input-field"
//                   value={formData.dueDate}
//                   onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//                 />
//               </div>
//             </div>
            
//             <div className="flex space-x-3">
//               <button type="submit" className="btn-primary">
//                 {editingTask ? 'Update Task' : 'Create Task'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false);
//                   setEditingTask(null);
//                   resetForm();
//                 }}
//                 className="btn-secondary"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Tasks List */}
//       <div className="space-y-4">
//         {filteredTasks.length === 0 ? (
//           <div className="card text-center py-12">
//             <p className="text-gray-500">No tasks found</p>
//           </div>
//         ) : (
//           filteredTasks.map((task) => (
//             <div
//               key={task._id}
//               className={`card ${
//                 task.status === 'completed' ? 'bg-gray-50' : ''
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-3">
//                     <h3 className={`font-medium ${
//                       task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
//                     }`}>
//                       {task.title}
//                     </h3>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       {task.category}
//                     </span>
//                   </div>
                  
//                   {task.description && (
//                     <p className={`mt-2 text-sm ${
//                       task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
//                     }`}>
//                       {task.description}
//                     </p>
//                   )}
                  
//                   <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
//                     <div className="flex items-center space-x-1">
//                       <Calendar className="h-4 w-4" />
//                       <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Tag className="h-4 w-4" />
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         task.status === 'completed'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {task.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 ml-4">
//                   {task.status === 'pending' && (
//                     <button
//                       onClick={() => handleComplete(task._id)}
//                       className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
//                       title="Mark as completed"
//                     >
//                       <CheckCircle className="h-5 w-5" />
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => handleEdit(task)}
//                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                     title="Edit task"
//                   >
//                     <Edit className="h-5 w-5" />
//                   </button>
                  
//                   <button
//                     onClick={() => handleDelete(task._id)}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                     title="Delete task"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tasks; 


import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import api from '../services/api';
import { Plus, Edit, Trash2, CheckCircle, Calendar, Tag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created successfully');
      }
      setShowForm(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      dueDate: task.dueDate.split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await taskService.markTaskComplete(taskId);
      toast.success('Task marked as completed');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to mark task as completed');
    }
  };

  const generateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required to generate description");
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post('/ai/description', { summary: formData.title });
      setFormData(prev => ({ ...prev, description: res.data.description }));
      toast.success("Generated task description");
    } catch (err) {
      toast.error("AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      dueDate: '',
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks.csv');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: 'Title', dataKey: 'title' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Due Date', dataKey: 'dueDate' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = filteredTasks.map(task => ({
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status,
    }));
    autoTable(doc, { columns, body: rows });
    doc.save('tasks.pdf');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-end">
        <button onClick={exportToCSV} className="btn-secondary">Download CSV</button>
        <button onClick={exportToExcel} className="btn-secondary">Download Excel</button>
        <button onClick={exportToPDF} className="btn-secondary">Download PDF</button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and stay organized</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Pending ({tasks.filter(t => t.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  className="input-field flex-1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={generating}
                  className="btn-secondary flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  {generating ? 'Generating...' : 'AI Description'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className={`card ${task.status === 'completed' ? 'bg-gray-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {task.category}
                    </span>
                  </div>

                  {task.description && (
                    <p className={`mt-2 text-sm ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                  )}

                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleComplete(task._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Mark as completed"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit task"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete task"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;