import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { User } from '../App';
import { Trash2, Edit2, Plus, UserCircle } from 'lucide-react';

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const availableColors = [
  'bg-blue-300',
  'bg-pink-300',
  'bg-green-300',
  'bg-purple-300',
  'bg-yellow-300',
  'bg-red-300',
  'bg-indigo-300',
  'bg-orange-300',
  'bg-teal-300',
  'bg-cyan-300',
];

export function UserManagementDialog({
  open,
  onOpenChange,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: UserManagementDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  const handleAddUser = () => {
    if (newUserName.trim()) {
      onAddUser({
        name: newUserName.trim(),
        color: selectedColor,
      });
      setNewUserName('');
      setSelectedColor(availableColors[0]);
      setIsAdding(false);
    }
  };

  const handleUpdateUser = (user: User) => {
    onUpdateUser(user);
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Existing Users */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className={`w-10 h-10 ${user.color} rounded-full flex items-center justify-center text-white`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {editingId === user.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={user.name}
                      onChange={(e) =>
                        handleUpdateUser({ ...user, name: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <span className="flex-1 text-sm">{user.name}</span>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New User */}
          {isAdding ? (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-2">
                <Label>User Name</Label>
                <Input
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter user name"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Avatar Color</Label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 ${color} rounded-full border-2 transition-transform ${
                        selectedColor === color
                          ? 'border-gray-900 scale-110'
                          : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewUserName('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={!newUserName.trim()}>
                  Add User
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4" />
              Add New User
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
