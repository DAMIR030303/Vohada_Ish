/**
 * MessageInput komponent testlari
 */

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { ThemeProvider } from '../../context/ThemeContext';
import { MessageInput } from '../MessageInput';

// Mock utils
jest.mock('../../utils/soundEffects', () => ({
  playSound: jest.fn(),
  SoundType: {
    TAP: 'tap',
    BUTTON_PRESS: 'button_press',
    SELECTION: 'selection',
    SUCCESS: 'success',
    ERROR: 'error',
    NOTIFICATION: 'notification',
    SWIPE: 'swipe',
    REFRESH: 'refresh',
  },
}));

jest.mock('../../utils/haptics', () => ({
  triggerHaptic: jest.fn(),
  HapticType: {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    SELECTION: 'selection',
  },
}));

describe('MessageInput', () => {
  const mockOnSend = jest.fn();
  const mockOnTyping = jest.fn();

  const renderComponent = (
    onSend = mockOnSend,
    onTyping = mockOnTyping,
    disabled = false,
  ) => {
    return render(
      <ThemeProvider>
        <MessageInput
          onSend={onSend}
          onTyping={onTyping}
          placeholder="Type a message..."
          disabled={disabled}
        />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field correctly', () => {
    const { getByPlaceholderText } = renderComponent();
    expect(getByPlaceholderText('Type a message...')).toBeTruthy();
  });

  it('calls onTyping when text changes', async () => {
    const { getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Type a message...');

    fireEvent.changeText(input, 'Hello');

    await waitFor(() => {
      expect(mockOnTyping).toHaveBeenCalledWith(true);
    });
  });

  it('calls onSend when send button is pressed', async () => {
    const { getByPlaceholderText, getByLabelText } = renderComponent();
    const input = getByPlaceholderText('Type a message...');
    const sendButton = getByLabelText('Send message');

    fireEvent.changeText(input, 'Hello');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith('Hello');
    });
  });

  it('clears input after sending', async () => {
    const { getByPlaceholderText, getByLabelText } = renderComponent();
    const input = getByPlaceholderText('Type a message...');
    const sendButton = getByLabelText('Send message');

    fireEvent.changeText(input, 'Hello');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('disables send button when input is empty', () => {
    const { getByLabelText } = renderComponent();
    const sendButton = getByLabelText('Send message');

    expect(sendButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('enables send button when input has text', () => {
    const { getByPlaceholderText, getByLabelText } = renderComponent();
    const input = getByPlaceholderText('Type a message...');
    const sendButton = getByLabelText('Send message');

    fireEvent.changeText(input, 'Hello');

    expect(sendButton.props.accessibilityState?.disabled).toBe(false);
  });

  it('respects disabled prop', () => {
    const { getByPlaceholderText } = renderComponent(
      mockOnSend,
      mockOnTyping,
      true,
    );
    const input = getByPlaceholderText('Type a message...');

    expect(input.props.editable).toBe(false);
  });

  it('does not send empty messages', async () => {
    const { getByLabelText, getByPlaceholderText } = renderComponent();
    const input = getByPlaceholderText('Type a message...');
    const sendButton = getByLabelText('Send message');

    // Faqat bo'sh joylar
    fireEvent.changeText(input, '   ');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockOnSend).not.toHaveBeenCalled();
    });
  });

  it('trims message before sending', async () => {
    const { getByPlaceholderText, getByLabelText } = renderComponent();
    const input = getByPlaceholderText('Type a message...');
    const sendButton = getByLabelText('Send message');

    fireEvent.changeText(input, '  Hello  ');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith('Hello');
    });
  });
});
