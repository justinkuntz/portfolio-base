const codeBlocks = document.querySelectorAll('pre:has(code)');

// add a plain browser button after each code block
codeBlocks.forEach((code) => {
  if (code.nextElementSibling?.matches('[data-copy-button]')) {
    return;
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Copy';
  btn.setAttribute('data-copy-button', '');
  btn.addEventListener('click', () => copyCode(code, btn));

  code.insertAdjacentElement('afterend', btn);
});

/**
* @param {HTMLElement} codeElement
* @param {HTMLButtonElement} button
*/
function copyCode(codeElement, button) {
  const codeBlock = getChildByTagName(codeElement, 'CODE');
  if (!codeBlock) return;

  navigator.clipboard.writeText(codeBlock.innerText);
  button.textContent = 'Copied';
  setTimeout(() => {
    if (button.isConnected) {
      button.textContent = 'Copy';
    }
  }, 1000);
}

function getChildByTagName(element, tagName) {
  return Array.from(element.children).find((child) => child.tagName === tagName);
}
