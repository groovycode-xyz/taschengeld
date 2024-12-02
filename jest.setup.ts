import { jest } from '@jest/globals';

// Mock fetch globally
(global as any).fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  } as Response)
);

beforeEach(() => {
  // Reset all mocks before each test
  jest.resetAllMocks();
  
  // Reset fetch mock to default behavior
  (global as any).fetch = jest.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    } as Response)
  );
}); 