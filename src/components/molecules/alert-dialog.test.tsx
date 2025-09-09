import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

describe('AlertDialog Components', () => {
  it('AlertDialog opens and closes correctly', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Test Title</AlertDialogTitle>
          <AlertDialogDescription>Test Description</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Action</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('AlertDialogTrigger opens the dialog', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Trigger</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Dialog Title</AlertDialogTitle>
          <AlertDialogDescription>Dialog description for accessibility.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );
    fireEvent.click(screen.getByText('Trigger'));
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('AlertDialogContent renders its children', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Content Title</AlertDialogTitle>
          <AlertDialogDescription>Content description for accessibility.</AlertDialogDescription>
          <div>Content</div>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('AlertDialogHeader renders its children', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Header Title</AlertDialogTitle>
          <AlertDialogHeader>
            <div>Header Content</div>
          </AlertDialogHeader>
          <AlertDialogDescription>Header description for accessibility.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('AlertDialogFooter renders its children', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Footer Title</AlertDialogTitle>
          <AlertDialogDescription>Footer description for accessibility.</AlertDialogDescription>
          <AlertDialogFooter>
            <div>Footer Content</div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('AlertDialogTitle renders its children', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title Text</AlertDialogTitle>
          <AlertDialogDescription>Title description for accessibility.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('AlertDialogDescription renders its children', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Title Text</AlertDialogTitle>
          <AlertDialogDescription>Description Text</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByText('Description Text')).toBeInTheDocument();
  });

  it('AlertDialogAction triggers action', () => {
    const handleAction = vi.fn();
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Action Title</AlertDialogTitle>
          <AlertDialogDescription>Action dialog description for accessibility.</AlertDialogDescription>
          <AlertDialogAction onClick={handleAction}>Perform Action</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
    fireEvent.click(screen.getByText('Perform Action'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('AlertDialogCancel closes dialog', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Cancel Title</AlertDialogTitle>
          <AlertDialogDescription>Cancel dialog description for accessibility.</AlertDialogDescription>
          <AlertDialogCancel>Close Dialog</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );
    fireEvent.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Close Dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close Dialog'));
    expect(screen.queryByText('Close Dialog')).not.toBeInTheDocument();
  });
});
