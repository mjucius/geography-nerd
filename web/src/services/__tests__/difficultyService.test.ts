import { describe, expect, it } from 'vitest';
import { determineNextLevel } from '../difficultyService';

describe('determineNextLevel', () => {
  it.each([8, 9, 10])('%i out of 10 unlocks the next level', (score) => {
    expect(determineNextLevel(score, 3)).toBe(4);
  });

  it.each([0, 5, 7])('%i out of 10 stays on the same level', (score) => {
    expect(determineNextLevel(score, 3)).toBe(3);
  });

  it('stays at level 10', () => {
    expect(determineNextLevel(10, 10)).toBe(10);
  });
});
