import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tabs, TabButton } from '../tabs'

describe('TabButton', () => {
  it('should match snapshot - selected', () => {
    const { container } = render(<TabButton selected>Tab 1</TabButton>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - not selected', () => {
    const { container } = render(<TabButton>Tab 1</TabButton>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - with icon', () => {
    const { container } = render(<TabButton icon={<span>🎯</span>}>Tab 1</TabButton>)
    expect(container.firstChild).toMatchSnapshot()
  })
})

describe('Tabs', () => {
  const mockTabs = [
    { id: '1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: '2', label: 'Tab 2', content: <div>Content 2</div> },
    { id: '3', label: 'Tab 3', content: <div>Content 3</div> },
  ]

  it('should match snapshot - basic tabs', () => {
    const { container } = render(<Tabs tabs={mockTabs} selectedId="1" onChange={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - second tab selected', () => {
    const { container } = render(<Tabs tabs={mockTabs} selectedId="2" onChange={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - with icons', () => {
    const tabsWithIcons = [
      { id: '1', label: 'Tab 1', icon: <span>📝</span>, content: <div>Content 1</div> },
      { id: '2', label: 'Tab 2', icon: <span>⚙️</span>, content: <div>Content 2</div> },
    ]
    const { container } = render(<Tabs tabs={tabsWithIcons} selectedId="1" onChange={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
