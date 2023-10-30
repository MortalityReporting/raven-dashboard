import { SanitizedUrlPipe } from './sanitized.pipe';

describe('SanitizedPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizedUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
