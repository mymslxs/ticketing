import type { NextPage, GetServerSideProps } from 'next';
import buildClient from '../api/build-client';

interface HomePage {
  currentUser: {
    email: string;
    id: string;
  } | null;
}

const Home: NextPage<HomePage> = ({ currentUser }) => {
  return (
    <div>
      <h1>{currentUser ? 'Your are signedin' : 'You are not signedin'}</h1>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/current-user');
    return {
      props: {
        currentUser: data.currentUser,
      },
    };
  } catch (err) {
    return {
      props: {
        currentUser: null,
      },
    };
  }
};
