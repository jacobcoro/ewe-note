import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders', () => {
    render(<App />);
    expect(screen.getByText('count is 0')).toBeInTheDocument();
  });
});
