const requests = new Map<string, { count: number; start: number }>();

export function rateLimit(ip: string, limit = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now();

  const user = requests.get(ip);

  // First request
  if (!user) {
    requests.set(ip, { count: 1, start: now });
    return true;
  }

  // Reset window
  if (now - user.start > windowMs) {
    requests.set(ip, { count: 1, start: now });
    return true;
  }

  // Limit exceeded
  if (user.count >= limit) {
    return false;
  }

  // Increment count
  user.count++;
  requests.set(ip, user);

  return true;
}