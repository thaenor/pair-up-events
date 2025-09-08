import { render, screen, within, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './toast';

describe('Toast Components', () => {
  it('ToastProvider renders its children', () => {
    render(
      <ToastProvider>
        <div>Child</div>
      </ToastProvider>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('ToastViewport renders with correct class names', async () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
    const viewport = await screen.findByLabelText('Notifications (F8)');
    const list = within(viewport).getByRole('list');
    expect(list).toHaveClass(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]'
    );
  });

  it('Toast renders with default variant', async () => {
    render(
      <ToastProvider>
        <Toast open />
        <ToastViewport />
      </ToastProvider>
    );
    const toast = await screen.findByTestId('toast-root');
    expect(toast).toHaveClass('border bg-background text-foreground');
  });

  it('Toast renders with destructive variant', async () => {
    render(
      <ToastProvider>
        <Toast open variant="destructive" />
        <ToastViewport />
      </ToastProvider>
    );
    const toast = await screen.findByTestId('toast-root');
    expect(toast).toHaveClass('destructive group border-destructive bg-destructive text-destructive-foreground');
  });

  it('ToastAction renders with correct class names', async () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastAction altText="action">Action Button</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const actionButton = await screen.findByTestId('toast-action');
    expect(actionButton).toHaveClass(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
    );
  });

  it('ToastClose renders with correct aria-label', async () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const closeButton = await screen.findByTestId('toast-close');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
  });

  it('ToastTitle renders its children', async () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const title = await screen.findByTestId('toast-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Title');
  });

  it('ToastDescription renders its children', async () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastDescription>Description</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const description = await screen.findByTestId('toast-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Description');
  });
});
