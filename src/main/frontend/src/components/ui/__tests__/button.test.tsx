import { render, screen, fireEvent } from '../../../test/utils';
import { Button } from '../button';

// Mock the cn utility function
jest.mock('@lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled button</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('disabled');
  });

  it('applies default variant classes', () => {
    render(<Button>Default button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('applies destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('applies outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('border', 'border-input', 'bg-background');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
  });

  it('applies link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline');
  });

  it('applies small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-8', 'rounded-md', 'px-3', 'text-xs');
  });

  it('applies large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-10', 'rounded-md', 'px-8');
  });

  it('applies icon size', () => {
    render(<Button size="icon">🔍</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('h-9', 'w-9');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Ref button');
  });

  it('supports asChild prop with Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link as button</a>
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('passes through HTML button attributes', () => {
    render(
      <Button type="submit" form="test-form" data-testid="submit-button">
        Submit
      </Button>
    );

    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('form', 'test-form');
  });

  it('has correct display name', () => {
    expect(Button.displayName).toBe('Button');
  });

  // Accessibility tests
  it('is accessible with keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Accessible button</Button>);

    const button = screen.getByRole('button');
    button.focus();

    expect(button).toHaveFocus();

    // For HTML buttons, Enter and Space keys trigger click events
    // We need to simulate the browser's default behavior
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button); // Simulate the browser's default behavior for Enter
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.click(button); // Simulate the browser's default behavior for Space
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('has proper focus styles', () => {
    render(<Button>Focus test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-1');
  });

  it('shows disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });
});
