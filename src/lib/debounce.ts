const SEARCH_DELAY = 350;

export function debounce(run: () => void): () => void {
  const timer = window.setTimeout(run, SEARCH_DELAY);
  return () => {
    window.clearTimeout(timer);
  };
}
