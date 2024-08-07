// pages/index.js

import Chatbot from './components/chatbot.js';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col sm:p-24 p-2'>
      <div className=''>
        <h1 className='text-center text-emerald-400 font-bold uppercase text-2xl pt-3'>AI Customer Support Chatbot</h1>
        <Chatbot />
      </div>
    </main>
  );
}
