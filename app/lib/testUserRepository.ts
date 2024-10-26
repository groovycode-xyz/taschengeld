import { userRepository } from './userRepository';
import { CreateUserInput } from '@/app/types/user';

async function testUserRepository() {
  try {
    // Test create
    const newUser: CreateUserInput = {
      name: 'Test User',
      icon: 'test-icon',
      soundurl: 'test-sound.mp3', // Changed from soundUrl to soundurl
      birthday: '2000-01-01',
      role: 'child',
    };
    const createdUser = await userRepository.create(newUser);
    console.log('Created user:', createdUser);

    // Test getAll
    const allUsers = await userRepository.getAll();
    console.log('All users:', allUsers);

    // Test getById
    const retrievedUser = await userRepository.getById(Number(createdUser.user_id));
    console.log('Retrieved user:', retrievedUser);

    // Test update
    const updatedUser = await userRepository.update(Number(createdUser.user_id), {
      name: 'Updated Test User',
    });
    console.log('Updated user:', updatedUser);

    // Test delete
    const deleteResult = await userRepository.delete(Number(createdUser.user_id));
    console.log('User deleted:', deleteResult);

    // Verify deletion
    const deletedUser = await userRepository.getById(Number(createdUser.user_id));
    console.log('Deleted user (should be null):', deletedUser);
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close the database connection pool
    const pool = (await import('./db')).default;
    await pool.end();
  }
}

testUserRepository();
