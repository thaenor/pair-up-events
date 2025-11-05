import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventPreviewCard from '../EventPreviewCard'
import type { EventPreviewData } from '@/entities/event/event'

describe('EventPreviewCard', () => {
  const mockEventData: EventPreviewData = {
    title: 'Test Event',
    description: 'Test description',
    activity: 'Hiking',
    date: '2024-12-25',
    time: '14:00',
    location: {
      address: '123 Main St',
      city: 'San Francisco',
    },
    preferences: {
      duoType: 'friends',
      desiredVibes: ['adventurous', 'outdoor'],
      ageRange: {
        min: 25,
        max: 35,
      },
    },
  }

  it('should render event preview card with all data', () => {
    render(<EventPreviewCard eventData={mockEventData} />)
    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Hiking')).toBeInTheDocument()
    expect(screen.getByText(/2024-12-25/)).toBeInTheDocument()
    expect(screen.getByText(/at 14:00/)).toBeInTheDocument()
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument()
    expect(screen.getByText(/San Francisco/)).toBeInTheDocument()
    expect(screen.getByText('friends')).toBeInTheDocument()
    expect(screen.getByText('adventurous')).toBeInTheDocument()
    expect(screen.getByText('outdoor')).toBeInTheDocument()
    expect(screen.getByText(/Age range: 25-35/)).toBeInTheDocument()
  })

  it('should render with minimal required data', () => {
    const minimalData: EventPreviewData = {
      title: 'Minimal Event',
      activity: 'Running',
    }
    render(<EventPreviewCard eventData={minimalData} />)
    expect(screen.getByText('Minimal Event')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Date/Time TBD')).toBeInTheDocument()
    expect(screen.getByText('Location TBD')).toBeInTheDocument()
  })

  it('should display TBD for missing optional fields', () => {
    const dataWithoutOptional: EventPreviewData = {
      title: 'Test',
      activity: 'Activity',
    }
    render(<EventPreviewCard eventData={dataWithoutOptional} />)
    expect(screen.getByText('Date/Time TBD')).toBeInTheDocument()
    expect(screen.getByText('Location TBD')).toBeInTheDocument()
  })

  it('should render with date but no time', () => {
    const dataWithDateOnly: EventPreviewData = {
      title: 'Test',
      activity: 'Activity',
      date: '2024-12-25',
    }
    render(<EventPreviewCard eventData={dataWithDateOnly} />)
    expect(screen.getByText(/2024-12-25/)).toBeInTheDocument()
    // Check that the When section doesn't contain "at" (time format would be "at HH:MM")
    // The word "at" might appear in "Location TBD" so we need to check specifically in the When section
    const whenSection = screen.getByText(/When:/).closest('div')
    const whenText = whenSection?.textContent || ''
    expect(whenText).toContain('2024-12-25')
    expect(whenText).not.toContain('at')
  })

  it('should render with location address only', () => {
    const dataWithAddressOnly: EventPreviewData = {
      title: 'Test',
      activity: 'Activity',
      location: {
        address: '123 Main St',
      },
    }
    render(<EventPreviewCard eventData={dataWithAddressOnly} />)
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument()
    expect(screen.queryByText(/San Francisco/)).not.toBeInTheDocument()
  })

  it('should render with location city only', () => {
    const dataWithCityOnly: EventPreviewData = {
      title: 'Test',
      activity: 'Activity',
      location: {
        city: 'San Francisco',
      },
    }
    render(<EventPreviewCard eventData={dataWithCityOnly} />)
    expect(screen.getByText(/San Francisco/)).toBeInTheDocument()
  })

  it('should render preferences without age range', () => {
    const dataWithoutAgeRange: EventPreviewData = {
      title: 'Test',
      activity: 'Activity',
      preferences: {
        duoType: 'couples',
        desiredVibes: ['romantic'],
      },
    }
    render(<EventPreviewCard eventData={dataWithoutAgeRange} />)
    expect(screen.getByText('couples')).toBeInTheDocument()
    expect(screen.getByText('romantic')).toBeInTheDocument()
    expect(screen.queryByText(/Age range/)).not.toBeInTheDocument()
  })

  it('should render with activity as title fallback', () => {
    const dataWithoutTitle: EventPreviewData = {
      title: '',
      activity: 'Hiking',
    }
    render(<EventPreviewCard eventData={dataWithoutTitle} />)
    // Activity appears in both title and activity section
    const activityTexts = screen.getAllByText('Hiking')
    expect(activityTexts.length).toBeGreaterThan(0)
  })

  it('should call onConfirm when Copy invite link button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<EventPreviewCard eventData={mockEventData} onConfirm={onConfirm} />)
    const copyButton = screen.getByRole('button', { name: /copy invite link/i })
    await user.click(copyButton)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<EventPreviewCard eventData={mockEventData} onEdit={onEdit} />)
    const editButton = screen.getByRole('button', { name: /edit event details/i })
    await user.click(editButton)
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('should render both Edit and Copy invite link buttons when both handlers provided', () => {
    render(<EventPreviewCard eventData={mockEventData} onEdit={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.getByRole('button', { name: /edit event details/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy invite link/i })).toBeInTheDocument()
    expect(screen.getByText(/send this link to your pair to confirm the event/i)).toBeInTheDocument()
  })

  it('should not render action buttons when no handlers provided', () => {
    render(<EventPreviewCard eventData={mockEventData} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render only Copy invite link button when only onConfirm provided', () => {
    render(<EventPreviewCard eventData={mockEventData} onConfirm={vi.fn()} />)
    expect(screen.getByRole('button', { name: /copy invite link/i })).toBeInTheDocument()
    expect(screen.getByText(/send this link to your pair to confirm the event/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
  })

  it('should render only Edit button when only onEdit provided', () => {
    render(<EventPreviewCard eventData={mockEventData} onEdit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /edit event details/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /copy invite link/i })).not.toBeInTheDocument()
  })

  it('should match snapshot with full data', () => {
    const { container } = render(<EventPreviewCard eventData={mockEventData} onEdit={vi.fn()} onConfirm={vi.fn()} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with minimal data', () => {
    const minimalData: EventPreviewData = {
      title: 'Minimal Event',
      activity: 'Running',
    }
    const { container } = render(<EventPreviewCard eventData={minimalData} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
