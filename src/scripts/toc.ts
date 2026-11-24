/** Marks the "On this page" link for the section currently being read. */
export function watchToc(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.toc a')];
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const setActive = (id: string) => {
    for (const [key, a] of byId) {
      if (key === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const top = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setActive(top.target.id);
    },
    { rootMargin: '0px 0px -65% 0px' },
  );

  for (const id of byId.keys()) {
    const target = document.getElementById(id);
    if (target) observer.observe(target);
  }
}
