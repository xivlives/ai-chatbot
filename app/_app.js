// pages/index.js

import Chatbot from './components/chatbot.js';
import { AuthProvider } from './authContext.js';
import { useAuth } from './authContext.js';
export default function Home() {
  const {user, logout} = useAuth()
  return (
    <AuthProvider>
      <main className='flex min-h-screen flex-col sm:p-24 p-2'>
        <div className=''>
          <h1 className='text-center text-emerald-400 font-bold uppercase text-2xl pt-3'>AI Customer Support Chatbot</h1>
          <button onClick={logout} className="p-3 border-2 rounded-md bg-red-500 text-white hover:bg-red-700 active:bg-gray-400 mb-4">Logout</button>

          <Chatbot />
        </div>
      </main>
    </AuthProvider>
    
  );
}
