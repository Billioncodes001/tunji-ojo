/** Wrap text nodes in masked word spans, preserving nested elements and their attributes. */
export function splitWords(el: Element): HTMLElement[] {
  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      (node.textContent ?? '').split(/(\s+)/).forEach((word) => {
        if (!word || /^\s+$/.test(word)) {
          fragment.append(document.createTextNode(word));
        } else {
          const mask = document.createElement('span');
          const inner = document.createElement('span');
          mask.className = 'w';
          inner.className = 'w__i';
          inner.textContent = word;
          mask.append(inner);
          fragment.append(mask);
        }
      });
      node.parentNode?.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Existing word masks are already split; comments and other node types stay untouched.
      if ((node as Element).classList.contains('w')) return;
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(el.childNodes).forEach(walk);
  return Array.from(el.querySelectorAll<HTMLElement>('.w__i'));
}
