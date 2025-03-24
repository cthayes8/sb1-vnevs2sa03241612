import { WaitlistFormData } from '../types';

export const sendWaitlistEmail = async (formData: WaitlistFormData): Promise<boolean> => {
  try {
    const response = await fetch('/.netlify/functions/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to process request' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json().catch(() => ({ success: false }));
    if (!data.success) {
      throw new Error('Failed to join waitlist');
    }

    return true;
  } catch (error) {
    console.error('Error sending waitlist email:', error);
    throw error;
  }
};