import React from 'react';
import { chat } from 'shared';

interface LobbyProps {
  user: chat.IUser;
  setUser: React.Dispatch<React.SetStateAction<chat.IUser>>;
  handleLogin: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ user, setUser, handleLogin }) => {
  const handleLoginBtnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome back, {user.userName}
        </h2>
        <form onSubmit={handleLoginBtnSubmit} className="space-y-6">
          {!isReturningUser && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                value={user?.userName ?? ''}
                onChange={(e) => setUser((prev) => ({ ...prev!, userName: e.target.value }))}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50"
            disabled={!user?.userName.trim()}
          >
            {isReturningUser ? 'Enter Chat' : 'Join Chat'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;