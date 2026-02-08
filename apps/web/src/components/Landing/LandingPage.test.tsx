import { render, screen } from "@testing-library/react";
import { LandingPage } from "./LandingPage";
import { vi, expect, describe, test, beforeEach } from "vitest";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe("LandingPage", () => {
  const mockOnLogin = vi.fn();
  const mockOnRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders hero section with main title", () => {
    render(<LandingPage onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    const title = screen.getByText(/Secure Zero-Knowledge/i);
    expect(title).toBeInTheDocument();
  });

  test("renders stats section", () => {
    render(<LandingPage onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    expect(screen.getByText(/Trusted Users/i)).toBeInTheDocument();
  });

  test("renders feature and compare sections", () => {
    render(<LandingPage onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    expect(screen.getByText(/Total Transparency/i)).toBeInTheDocument();
  });

  test("renders footer with legal links", () => {
    render(<LandingPage onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });
});
