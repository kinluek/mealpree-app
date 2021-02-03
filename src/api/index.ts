import axios from 'axios';

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:9090';

export const signIn = async (email: string, uid: string) => {
  await axios.post(
    `${API_HOST}/signin`,
    { email, uid },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
