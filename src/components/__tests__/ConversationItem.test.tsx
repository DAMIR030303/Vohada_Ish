/**
 * ConversationItem komponent testlari
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ThemeProvider } from '../../context/ThemeContext';
import { Conversation } from '../../types';
import { ConversationItem } from '../ConversationItem';

// Mock auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user1',
      email: 'test@test.com',
      fullName: 'Test User',
    },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('ConversationItem', () => {
  const mockConversation: Conversation = {
    id: 'conv1',
    participants: ['user1', 'user2'],
    participantDetails: {
      user2: {
        name: 'John Doe',
        avatar: undefined,
        online: true,
      },
    },
    lastMessage: {
      content: 'Hello there!',
      senderId: 'user2',
      createdAt: new Date(),
    },
    unreadCount: {
      user1: 2,
      user2: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnPress = jest.fn();

  const renderComponent = (conversation: Conversation = mockConversation) => {
    return render(
      <ThemeProvider>
        <ConversationItem conversation={conversation} onPress={mockOnPress} />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders conversation correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Hello there!')).toBeTruthy();
  });

  it('shows unread count badge', () => {
    const { getByText } = renderComponent();
    expect(getByText('2')).toBeTruthy();
  });

  it('shows online indicator when user is online', () => {
    const { getByTestId } = renderComponent();
    // Online indicator mavjudligini tekshirish
    const onlineIndicator = getByTestId('online-indicator');
    expect(onlineIndicator).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText('John Doe'));
    expect(mockOnPress).toHaveBeenCalledWith('conv1');
  });

  it('shows typing indicator when user is typing', () => {
    const typingConversation: Conversation = {
      ...mockConversation,
      typing: {
        user2: true,
      },
    };
    const { getByText } = renderComponent(typingConversation);
    expect(getByText('typing')).toBeTruthy();
  });

  it('shows job title if present', () => {
    const jobConversation: Conversation = {
      ...mockConversation,
      jobTitle: 'Senior Developer',
    };
    const { getByText } = renderComponent(jobConversation);
    expect(getByText(/Senior Developer/)).toBeTruthy();
  });

  it('shows "You:" prefix for own messages', () => {
    const ownMessageConversation: Conversation = {
      ...mockConversation,
      lastMessage: {
        content: 'My message',
        senderId: 'user1',
        createdAt: new Date(),
      },
    };
    const { getByText } = renderComponent(ownMessageConversation);
    expect(getByText(/You: My message/)).toBeTruthy();
  });

  it('shows "No messages yet" when no last message', () => {
    const emptyConversation: Conversation = {
      ...mockConversation,
      lastMessage: undefined,
    };
    const { getByText } = renderComponent(emptyConversation);
    expect(getByText('No messages yet')).toBeTruthy();
  });
});
