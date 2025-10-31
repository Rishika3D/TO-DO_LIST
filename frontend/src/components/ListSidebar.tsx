import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { TodoList } from '../App';

interface ListSidebarProps {
  lists: TodoList[];
  currentListId: string;
  onSelectList: (listId: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (listId: string) => void;
}

export function ListSidebar({
  lists,
  currentListId,
  onSelectList,
  onAddList,
  onDeleteList,
}: ListSidebarProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setIsAddDialogOpen(false);
    }
  };

  return (
    <>
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-sm text-gray-500 mb-3">Boards</h2>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            New Board
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg mb-1 text-left transition-colors group ${
                currentListId === list.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 bg-gradient-to-br ${list.color} rounded-lg text-sm flex-shrink-0`}
                >
                  {list.icon}
                </div>
                <span className="text-sm truncate">{list.name}</span>
              </div>
              {lists.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              )}
            </button>
          ))}
        </div>
      </aside>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddList();
                }
              }}
              placeholder="Board name"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddList} disabled={!newListName.trim()}>
                Create Board
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
