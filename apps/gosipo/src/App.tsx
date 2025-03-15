import { auth, chat } from "shared";
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from "react";
import { createRouter, RootRoute, Route, useNavigate, Outlet } from "@tanstack/react-router";

interface UserState {
  user: auth.UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<auth.UserInfo>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
})

export const { setUser, setLoading, setError } = userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const Lobby: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading());
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data: auth.UserInfo = await response.json();
          dispatch(setUser(data));
          sessionStorage.setItem('user', JSON.stringify(data));
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        dispatch(setError('Could not authenticate. Please try again.'));
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: '/chat' }); // Corrected navigation path
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-text">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          { !user ? 'Loading... Please wait.' : `Welcome back, ${user.name}`}
        </h2>
        <form onSubmit={handleJoinChat} className="space-y-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

interface ChatWindowProps {
  history: chat.IUserMessage[];
  windowWidth: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ history, windowWidth }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="min-h-full flex flex-col justify-end">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              windowWidth <= 768 && msg.user.id === user.id
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md px-3 py-2 rounded-lg ${
                msg.user.name === 'Notification'
                  ? 'bg-yellow-500 text-white'
                  : msg.user.id === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{msg.user.name}</span>
                <span className="text-xs opacity-75">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

interface HeaderProps {
  isConnected: boolean;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, handleLogout }) => {
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm p-2 flex items-center justify-between">
      <UserStatus isConnected={isConnected} user={user} />
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-all duration-200 font-medium text-sm hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </header>
  );
};

interface UserStatusProps {
  isConnected: boolean;
  user: auth.UserInfo;
}

const UserStatus: React.FC<UserStatusProps> = ({ isConnected, user }) => {
  return (
    <div className="flex flex-row items-center gap-2 font-semibold text-gray-800 justify-center">
      <span
        className={`inline-block w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        } animate-pulse`}
      ></span>
      <span>{user.name}</span>
    </div>
  );
};

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendMessage,
  handleKeyDown,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={sendMessage} className="flex flex-row flex-grow gap-2">
      <div className="relative flex-grow flex items-center justify-center">
        <textarea
          ref={textareaRef}
          className="w-full bg-white rounded-lg px-3 py-1 outline-none text-sm transition-all duration-200 whitespace-pre-wrap overflow-y-auto resize-none"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{
            minHeight: '30px',
            maxHeight: `${30 * 10}px`,
            overflowY: message.split('\n').length > 10 ? 'scroll' : 'hidden',
          }}
        />
      </div>
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          disabled={!message.trim()}
          className={`${message.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'} bg-white px-3 py-1 rounded-full transition-all duration-200 font-medium text-sm transform flex items-center justify-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [socket] = useState<Socket<chat.IServer2Client, chat.IClient2Server>>(io());
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<chat.IUserMessage[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      if (user) {
        const greetings: chat.IUserMessage = {
          user: { id: 'greetings', name: 'Notification' },
          message: `${user.name} joined the chat`,
          timestamp: Date.now(),
        };
        socket.emit('chat', greetings);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
      socket.connect();
    };

    const onChat = (msg: chat.IUserMessage) => setHistory((prev) => [...prev, msg]);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat', onChat);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat', onChat);
    };
  }, [socket, user]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage: chat.IUserMessage = {
      user,
      message,
      timestamp: Date.now(),
    };

    try {
      socket.emit('chat', newMessage);
      setMessage('');
    } catch (error) {
      dispatch(setError('Failed to send message.'));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const handleLogout = () => {
    if (!user) return;

    const logoutMessage: chat.IUserMessage = {
      user: { id: 'greetings', name: 'Notification' },
      message: `${user.name} left the chat`,
      timestamp: Date.now(),
    };

    try {
      socket.emit('chat', logoutMessage);
      socket.disconnect();
      setHistory([]);
      // Note: 'logout' action is not defined in userSlice; assuming it’s meant to clear user
      dispatch(setUser(null)); // Replace with proper logout action if defined elsewhere
      sessionStorage.removeItem('user');
      setMessage('');
      setIsConnected(false);
    } catch (error) {
      dispatch(setError('Failed to logout.'));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header isConnected={isConnected} handleLogout={handleLogout} />
      <ChatWindow history={history} windowWidth={windowWidth} />
      <div className="border-t bg-white px-2 py-2 shadow-lg">
        <div className="flex gap-4 justify-between max-w-6xl mx-auto">
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

// Define the root route with an Outlet
const rootRoute = new RootRoute({
  component: () => <Outlet />,
});

// Define the lobby route for the root path
const lobbyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '',
  component: Lobby,
});

// Define the chat route
const chatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'chat', // Relative path as a child route
  component: Chat,
});

// Create the route tree
export const routeTree = rootRoute.addChildren([lobbyRoute, chatRoute]);

// Create the router
export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center h-screen text-text">Loading...</div>
  ),
});