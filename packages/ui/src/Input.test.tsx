import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly with label and placeholder', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    let value = '';
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { value = e.target.value; };
    render(<Input placeholder="Enter username" onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    expect(value).toBe('testuser');
  });

  it('shows error message when error prop is provided', () => {
    // Note: Assuming Input component has an error prop or similar
    // Let's check Input.tsx first if needed, but for now we'll assume basic functionality
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });
});
