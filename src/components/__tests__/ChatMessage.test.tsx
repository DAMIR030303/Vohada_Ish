/**
 * ChatMessage komponent testlari
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemeProvider } from '../../context/ThemeContext';
import { Message } from '../../types';
import { ChatMessage } from '../ChatMessage';

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

describe('ChatMessage', () => {
  const mockMessage: Message = {
    id: 'msg1',
    conversationId: 'conv1',
    senderId: 'user2',
    senderName: 'John Doe',
    receiverId: 'user1',
    content: 'Hello there!',
    type: 'text',
    read: false,
    createdAt: new Date(),
  };

  const renderComponent = (
    message: Message = mockMessage,
    showAvatar = false,
  ) => {
    return render(
      <ThemeProvider>
        <ChatMessage message={message} showAvatar={showAvatar} />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text message correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Hello there!')).toBeTruthy();
  });

  it('shows read indicator for own read messages', () => {
    const ownReadMessage: Message = {
      ...mockMessage,
      senderId: 'user1',
      read: true,
    };
    const { getByText } = renderComponent(ownReadMessage);
    expect(getByText('✓✓')).toBeTruthy();
  });

  it('shows single check for own unread messages', () => {
    const ownUnreadMessage: Message = {
      ...mockMessage,
      senderId: 'user1',
      read: false,
    };
    const { getByText } = renderComponent(ownUnreadMessage);
    expect(getByText('✓')).toBeTruthy();
  });

  it('shows avatar when showAvatar is true', () => {
    const messageWithAvatar: Message = {
      ...mockMessage,
      senderAvatar: 'https://example.com/avatar.jpg',
    };
    const { UNSAFE_getByType } = renderComponent(messageWithAvatar, true);
    // Avatar Image elementini topish
    const images = UNSAFE_getByType('Image');
    expect(images).toBeTruthy();
  });

  it('does not show avatar when showAvatar is false', () => {
    const { queryByTestId } = renderComponent(mockMessage, false);
    // Avatar ko'rinmasligi kerak
    expect(queryByTestId('avatar')).toBeFalsy();
  });

  it('renders image message with media URL', () => {
    const imageMessage: Message = {
      ...mockMessage,
      type: 'image',
      mediaUrl: 'https://example.com/image.jpg',
      content: 'Check this out!',
    };
    const { getByText, UNSAFE_getByType } = renderComponent(imageMessage);
    expect(getByText('Check this out!')).toBeTruthy();
    const images = UNSAFE_getByType('Image');
    expect(images).toBeTruthy();
  });

  it('renders file message with attachment', () => {
    const fileMessage: Message = {
      ...mockMessage,
      type: 'file',
      mediaUrl: 'https://example.com/document.pdf',
      content: 'Resume.pdf',
    };
    const { getByText } = renderComponent(fileMessage);
    expect(getByText('Resume.pdf')).toBeTruthy();
    expect(getByText('📎')).toBeTruthy();
  });
});
