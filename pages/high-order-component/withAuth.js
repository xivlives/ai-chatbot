/* eslint-disable react/display-name */
// withAuth.js
import { useAuth } from '../../app/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (Component) => {
  return (props) => {
    const  user  = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('pages/user/register');
      }
    }, [user, router]);

    if (!user) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};

export default withAuth;
