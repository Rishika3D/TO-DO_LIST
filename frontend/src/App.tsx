import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BoardColumn } from './components/BoardColumn';
import { AddTaskDialog } from './components/AddTaskDialog';
import { ListSidebar } from './components/ListSidebar';
import { UserManagementDialog } from './components/UserManagementDialog';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Plus, LayoutGrid, ArrowUpDown, Users } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assignedTo?: string;
  createdAt: Date;
  listId: string;
}

export interface TodoList {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  color: string;
}

const initialUsers: User[] = [
  { id: '1', name: 'John Doe', color: 'bg-blue-300' },
  { id: '2', name: 'Jane Smith', color: 'bg-pink-300' },
  { id: '3', name: 'Mike Johnson', color: 'bg-green-300' },
];

const initialLists: TodoList[] = [
  { id: '1', name: 'Work Projects', icon: '💼', color: 'from-blue-200 to-purple-200' },
  { id: '2', name: 'Family Tasks', icon: '🏠', color: 'from-pink-200 to-rose-200' },
  { id: '3', name: 'Personal Goals', icon: '🎯', color: 'from-green-200 to-emerald-200' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create mockups for the new landing page with updated branding',
    status: 'in-progress',
    priority: 'high',
    tags: ['design', 'urgent'],
    createdAt: new Date('2024-10-28'),
    listId: '1',
  },
  {
    id: '2',
    title: 'Update documentation',
    description: 'Add examples and improve clarity in the API docs',
    status: 'todo',
    priority: 'medium',
    tags: ['docs'],
    createdAt: new Date('2024-10-29'),
    listId: '1',
  },
  {
    id: '3',
    title: 'Fix login bug',
    description: 'Users report issues with OAuth login on mobile',
    status: 'todo',
    priority: 'high',
    tags: ['bug', 'urgent'],
    createdAt: new Date('2024-10-30'),
    listId: '1',
  },
  {
    id: '4',
    title: 'Grocery shopping',
    description: 'Buy groceries for the week',
    status: 'todo',
    priority: 'medium',
    tags: ['shopping'],
    assignedTo: '1',
    createdAt: new Date('2024-10-29'),
    listId: '2',
  },
  {
    id: '5',
    title: 'Clean garage',
    description: 'Organize and clean the garage this weekend',
    status: 'in-progress',
    priority: 'low',
    tags: ['chores'],
    assignedTo: '2',
    createdAt: new Date('2024-10-27'),
    listId: '2',
  },
  {
    id: '6',
    title: 'Learn Spanish',
    description: 'Practice Spanish for 30 minutes daily',
    status: 'in-progress',
    priority: 'medium',
    tags: ['learning'],
    createdAt: new Date('2024-10-26'),
    listId: '3',
  },
];

type SortOrder = 'newest' | 'oldest';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lists, setLists] = useState<TodoList[]>(initialLists);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentListId, setCurrentListId] = useState<string>('1');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const currentList = lists.find(list => list.id === currentListId);
  const currentTasks = tasks.filter(task => task.listId === currentListId);

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'listId'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
      listId: currentListId,
    };
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleAddList = (name: string) => {
    const colors = [
      'from-indigo-200 to-blue-200',
      'from-orange-200 to-red-200',
      'from-teal-200 to-cyan-200',
      'from-yellow-200 to-amber-200',
      'from-violet-200 to-fuchsia-200',
      'from-lime-200 to-green-200',
    ];
    const icons = ['📋', '✨', '🚀', '💡', '🎨', '📚'];
    
    const newList: TodoList = {
      id: Date.now().toString(),
      name,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setLists([...lists, newList]);
    setCurrentListId(newList.id);
  };

  const handleDeleteList = (listId: string) => {
    if (lists.length === 1) return; // Don't delete the last list
    setLists(lists.filter(list => list.id !== listId));
    setTasks(tasks.filter(task => task.listId !== listId));
    if (currentListId === listId) {
      setCurrentListId(lists.find(list => list.id !== listId)?.id || lists[0].id);
    }
  };

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    // Unassign tasks from deleted user
    setTasks(tasks.map(task => 
      task.assignedTo === userId ? { ...task, assignedTo: undefined } : task
    ));
  };

  const todoTasks = sortTasks(currentTasks.filter(task => task.status === 'todo'));
  const inProgressTasks = sortTasks(currentTasks.filter(task => task.status === 'in-progress'));
  const doneTasks = sortTasks(currentTasks.filter(task => task.status === 'done'));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-[#fafafa]">
        {/* Sidebar */}
        <ListSidebar
          lists={lists}
          currentListId={currentListId}
          onSelectList={setCurrentListId}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b bg-white">
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${currentList?.color} rounded-lg text-xl`}>
                  {currentList?.icon}
                </div>
                <div>
                  <h1 className="text-lg">{currentList?.name}</h1>
                  <p className="text-sm text-gray-500">
                    {currentTasks.length} {currentTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setIsUserManagementOpen(true)} variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </div>
            </div>
          </header>

          {/* Board */}
          <main className="p-8">
            <div className="grid grid-cols-3 gap-6 max-w-[1600px] mx-auto">
              <BoardColumn
                title="To Do"
                status="todo"
                tasks={todoTasks}
                users={users}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                color="gray"
              />
              <BoardColumn
                title="In Progress"
                status="in-progress"
                tasks={inProgressTasks}
                users={users}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                color="blue"
              />
              <BoardColumn
                title="Done"
                status="done"
                tasks={doneTasks}
                users={users}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                color="green"
              />
            </div>
          </main>

          <AddTaskDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddTask={handleAddTask}
            users={users}
          />

          <UserManagementDialog
            open={isUserManagementOpen}
            onOpenChange={setIsUserManagementOpen}
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>
    </DndProvider>
  );
}
