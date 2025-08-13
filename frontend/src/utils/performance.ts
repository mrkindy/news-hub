// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

export const measureAsyncPerformance = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`${name} failed after ${end - start} milliseconds:`, error);
    throw error;
  }
};

// Web Vitals monitoring (simplified)
export const reportWebVitals = (metric: { name: string; value: number; id: string }) => {
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
};
