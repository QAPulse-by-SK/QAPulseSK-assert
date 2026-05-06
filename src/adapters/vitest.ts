// Vitest uses the same expect.extend API as Jest
// This adapter re-exports the Jest adapter for clarity
export {
  setupQAPulseMatchers,
  qaPulseMatchers,
} from './jest';

export type { APIResponse } from './jest';

export { setupQAPulseMatchers as default } from './jest';
