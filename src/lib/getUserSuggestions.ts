// lib/getUserSuggestions.ts

interface UserSuggestion {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  }
  
  export const getUserSuggestions = async (): Promise<UserSuggestion[]> => {
    // Simulating an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // Return mock data
    return [
      {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        avatarUrl: 'https://example.com/avatar1.jpg',
      },
      {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        avatarUrl: 'https://example.com/avatar2.jpg',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        username: 'bobjohnson',
        avatarUrl: 'https://example.com/avatar3.jpg',
      },
      {
        id: '4',
        name: 'Alice Brown',
        username: 'alicebrown',
        avatarUrl: 'https://example.com/avatar4.jpg',
      },
      {
        id: '5',
        name: 'Charlie Wilson',
        username: 'charliewilson',
        avatarUrl: 'https://example.com/avatar5.jpg',
      },
    ];
  };