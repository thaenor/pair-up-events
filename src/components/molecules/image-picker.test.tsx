import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImagePicker } from './image-picker';

// Mock the Input component
vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ onChange, ...props }) => (
    <input type="file" onChange={onChange} data-testid="mock-file-input" {...props} />
  )),
}));

describe('ImagePicker', () => {

  beforeEach(() => {
    const mockFileReaderInstance = {
      readAsDataURL: vi.fn(),
      onloadend: vi.fn(),
      result: 'data:image/png;base64,test',
    };
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReaderInstance);
  });

  it('renders a file input', () => {
    render(<ImagePicker onImageChange={vi.fn()} />);
    expect(screen.getByTestId('mock-file-input')).toBeInTheDocument();
    expect(screen.getByTestId('mock-file-input')).toHaveAttribute('type', 'file');
  });

  it('displays an image preview when a file is selected', async () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    render(<ImagePicker onImageChange={vi.fn()} />);
    const input = screen.getByTestId('mock-file-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [mockFile] } });
    });

    // Manually trigger onloadend
    (window.FileReader as vi.MockedClass<typeof FileReader>).mock.results[0].value.onloadend();

    const img = await screen.findByAltText('Preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/png;base64,test');
  });

  it('calls onImageChange with the selected file', async () => {
    const mockOnImageChange = vi.fn();
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    render(<ImagePicker onImageChange={mockOnImageChange} />);
    const input = screen.getByTestId('mock-file-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [mockFile] } });
    });

    // Manually trigger onloadend
    (window.FileReader as vi.MockedClass<typeof FileReader>).mock.results[0].value.onloadend();

    expect(mockOnImageChange).toHaveBeenCalledTimes(1);
    expect(mockOnImageChange).toHaveBeenCalledWith(mockFile);
  });

  it('clears the preview and calls onImageChange with null when no file is selected', async () => {
    const mockOnImageChange = vi.fn();
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    render(<ImagePicker onImageChange={mockOnImageChange} />);
    const input = screen.getByTestId('mock-file-input');

    // Select a file first

    await act(async () => {
      fireEvent.change(input, { target: { files: [mockFile] } });
    });
    (window.FileReader as vi.MockedClass<typeof FileReader>).mock.results[0].value.onloadend();
    await screen.findByAltText('Preview');

    // Clear the input
    await act(async () => {
      fireEvent.change(input, { target: { files: [] } });
    });

    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    expect(mockOnImageChange).toHaveBeenCalledWith(null);
  });
});