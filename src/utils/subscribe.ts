export const subscribeToBlog = async (email: string) => {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    return true;
  } catch (error) {
    console.error('Error subscribing:', error);
    return false;
  }
};