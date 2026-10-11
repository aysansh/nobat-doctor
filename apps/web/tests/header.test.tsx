import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '@/components/Header';

describe('Header (example test — the test setup works)', () => {
  it('renders the brand link pointing to /', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'نوبت دکتر' })).toHaveAttribute('href', '/');
  });
});
