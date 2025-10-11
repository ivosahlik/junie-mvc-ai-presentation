import { render, screen, fireEvent } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Input } from '../input';

// Mock the cn utility function
jest.mock('@lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('accepts and displays text input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('handles onChange events', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} placeholder="Test input" />);

    const input = screen.getByPlaceholderText('Test input');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
  });

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('disabled');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number');
  });

  it('applies default styling classes', () => {
    render(<Input placeholder="Styled input" />);
    const input = screen.getByPlaceholderText('Styled input');

    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-1',
      'text-sm',
      'shadow-sm',
      'transition-colors'
    );
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />);
    const input = screen.getByPlaceholderText('Custom');

    expect(input).toHaveClass('custom-input');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} placeholder="Ref input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.placeholder).toBe('Ref input');
  });

  it('supports controlled input', async () => {
    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Controlled input"
        />
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const input = screen.getByPlaceholderText('Controlled input');
    await user.type(input, 'controlled');

    expect(input).toHaveValue('controlled');
  });

  it('supports uncontrolled input with defaultValue', () => {
    render(<Input defaultValue="default text" placeholder="Uncontrolled" />);
    const input = screen.getByPlaceholderText('Uncontrolled');

    expect(input).toHaveValue('default text');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Focus test" />);

    const input = screen.getByPlaceholderText('Focus test');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('supports required attribute', () => {
    render(<Input required placeholder="Required input" />);
    const input = screen.getByPlaceholderText('Required input');

    expect(input).toHaveAttribute('required');
    expect(input).toBeRequired();
  });

  it('supports readonly attribute', () => {
    render(<Input readOnly value="readonly" placeholder="Readonly input" />);
    const input = screen.getByPlaceholderText('Readonly input');

    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('readonly');
  });

  it('supports min and max attributes for number inputs', () => {
    render(<Input type="number" min={0} max={100} placeholder="Number input" />);
    const input = screen.getByPlaceholderText('Number input');

    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('supports maxLength attribute', () => {
    render(<Input maxLength={10} placeholder="Max length input" />);
    const input = screen.getByPlaceholderText('Max length input');

    expect(input).toHaveAttribute('maxlength', '10');
  });

  it('supports pattern attribute', () => {
    render(<Input pattern="[0-9]*" placeholder="Pattern input" />);
    const input = screen.getByPlaceholderText('Pattern input');

    expect(input).toHaveAttribute('pattern', '[0-9]*');
  });

  // Accessibility tests
  it('is accessible with proper ARIA attributes', () => {
    render(
      <Input aria-label="Accessible input" aria-describedby="help-text" placeholder="ARIA input" />
    );
    const input = screen.getByPlaceholderText('ARIA input');

    expect(input).toHaveAttribute('aria-label', 'Accessible input');
    expect(input).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Keyboard test" />);

    const input = screen.getByPlaceholderText('Keyboard test');

    // Tab to focus
    await user.tab();
    expect(input).toHaveFocus();

    // Type text
    await user.keyboard('test text');
    expect(input).toHaveValue('test text');

    // Select all with Ctrl+A
    await user.keyboard('{Control>}a{/Control}');
    expect((input as HTMLInputElement).selectionStart).toBe(0);
    expect((input as HTMLInputElement).selectionEnd).toBe(9);
  });

  it('has proper focus styles', () => {
    render(<Input placeholder="Focus styles" />);
    const input = screen.getByPlaceholderText('Focus styles');

    expect(input).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-1',
      'focus-visible:ring-ring'
    );
  });

  it('shows disabled state correctly', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');

    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('handles file input type', () => {
    render(<Input type="file" data-testid="file-input" />);
    const input = screen.getByTestId('file-input');

    expect(input).toHaveAttribute('type', 'file');
  });
});
