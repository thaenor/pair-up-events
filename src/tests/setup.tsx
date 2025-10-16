import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Firebase
const mockUnsubscribe = vi.fn()

const mockAuth = {
  currentUser: null,
  onAuthStateChanged: vi.fn((_auth, callback: (user: unknown) => void) => {
    // Call callback with null initially
    if (typeof callback === 'function') {
      callback(null)
    }
    // Return unsubscribe function
    return mockUnsubscribe
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}

const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
}

const mockApp = {
  auth: mockAuth,
  firestore: mockFirestore,
}

// Mock Firebase modules
vi.mock('@/lib/firebase', () => ({
  auth: mockAuth,
  db: mockFirestore,
  app: mockApp,
  isFirebaseConfigured: true,
}))

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
  }
})

// Global test utilities
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
