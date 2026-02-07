import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddEntryForm } from './AddEntryForm';

// Mock the UI components if they are not rendered correctly in JSDOM
// For now we'll assume they work as they are vanilla CSS/HTML based
describe('AddEntryForm', () => {
  it('renders correctly', () => {
    render(<AddEntryForm onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText(/site/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('calls onAdd with correct values when submitted', () => {
    const onAdd = vi.fn();
    render(<AddEntryForm onAdd={onAdd} />);
    
    fireEvent.change(screen.getByPlaceholderText(/site/i), { target: { value: 'google.com' } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secure123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    
    expect(onAdd).toHaveBeenCalledWith('google.com', 'user@test.com', 'secure123');
  });
});
