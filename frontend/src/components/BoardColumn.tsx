import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Task, User } from '../App';
import { Circle } from 'lucide-react';

interface BoardColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  users: User[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
  color: 'gray' | 'blue' | 'green';
}

const colorMap = {
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
};

const dotColorMap = {
  gray: 'text-gray-400',
  blue: 'text-blue-500',
  green: 'text-green-500',
};

export function BoardColumn({
  title,
  status,
  tasks,
  users,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  color,
}: BoardColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      onMoveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center gap-2 mb-4 px-3">
        <Circle className={`w-2 h-2 fill-current ${dotColorMap[color]}`} />
        <h2 className="text-sm text-gray-700">{title}</h2>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${colorMap[color]} border`}>
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={drop}
        className={`flex-1 bg-white rounded-xl border-2 p-4 overflow-y-auto transition-colors ${
          isOver ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'
        }`}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              Drop tasks here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
