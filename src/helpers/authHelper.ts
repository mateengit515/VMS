import { fetchAuthSession } from 'aws-amplify/auth';

export const getAuthHeaders = async () => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
};
