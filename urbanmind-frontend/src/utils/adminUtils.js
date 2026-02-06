let currentSessionHealth = null;

export const getPlatformHealth = () => {
  // If we already generated a health value for this session (page load), return it
  if (currentSessionHealth !== null) {
    return currentSessionHealth;
  }

  // Generate new value between 85 and 100
  // Math.random() * (max - min + 1) + min
  currentSessionHealth = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
  return currentSessionHealth;
};
