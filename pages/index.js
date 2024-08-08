// pages/index.js
import withAuth from '@/pages/high-order-component/withAuth';
import HomeComponent from '../app/components/chatbot';

function Home() {
  return <HomeComponent />;
}

export default withAuth(Home);
