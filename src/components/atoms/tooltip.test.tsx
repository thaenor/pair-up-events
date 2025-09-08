import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

describe('Tooltip Components', () => {
  it('TooltipProvider renders its children', () => {
    render(
      <TooltipProvider>
        <div>Child</div>
      </TooltipProvider>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('Tooltip renders its children within a provider', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <div>Child</div>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('TooltipTrigger renders its children', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('TooltipContent renders its children and applies correct class names when opened', async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const tooltipContent = await screen.findByText('Tooltip Content', { selector: 'div' });
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveClass(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95'
    );
  });
});
