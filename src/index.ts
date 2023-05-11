'use client';

import { LFAI_HOST } from './widgetConst';
import { widgetFrameHandshake, widgetOnFrameEvent } from './widgetContract';

export type TLeftFieldPopupOptions = {
  pubKey: string; // Public key from your LeftFieldAI account
  elementId: string; // ID of the input field you want to fill in with the ChatGPT response
  prompt?: {
    default?: string; // Default ChatGPT prompt to pre-fill for the user
    placeholder?: string; // Placeholder text in the ChatGPT field
    suggested?: string[]; // Suggested starting prompts that your user can click on to get started without typing
  };
  popup?: {
    title?: string; // Title displayed to the user in the popup window UI
  };
};

const LFAI_POPUP_URL = `${LFAI_HOST}/app/embed/widget`;

export function lfaiCreatePopup(options: TLeftFieldPopupOptions) {
  if (!options.elementId) {
    throw new Error(`You must specify a valid "elementId" in the options object.`);
  }

  const optsEncoded = window.btoa(JSON.stringify(options));
  const fullUrl = `${LFAI_POPUP_URL}?opts=${optsEncoded}`;
  const frameWidth = 360;
  const frameHeight = 600;

  // Setup DOM Elements
  const idBase = `lfai__${options.elementId}`;
  const mFrame = domEl('iframe', {
    id: `${idBase}_mFrame`,
    src: fullUrl,
    style: {
      width: `${frameWidth}px`,
      height: `${frameHeight}px`,
    },
  });

  const mContent = domEl(
    'div',
    {
      id: `${idBase}_mContent`,
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: '0 auto',
        border: '0',
        background: 'white',
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        marginLeft: `-${frameWidth / 2}px`,
        marginTop: `-${frameHeight / 2}px`,
      },
    },
    [mFrame]
  );
  const mOverlay = domEl(
    'div',
    {
      id: `${idBase}_mOverlay`,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
      },
    },
    [mContent]
  );

  mContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  mOverlay.addEventListener('click', () => {
    document.body.removeChild(mOverlay);
  });

  document.body.appendChild(mOverlay);

  /**
   * Frame event binding
   */
  // @ts-ignore
  widgetFrameHandshake(mFrame.contentWindow);
  widgetOnFrameEvent('lfai_useResult', (msg: string) => {
    const inputEl = document.getElementById(options.elementId) as HTMLInputElement;

    if (!inputEl) {
      throw new Error(`Unable to find HTML input with id "${options.elementId}".`);
    }

    inputEl.value = msg;

    // Re-select overlay element and remove it
    const elOverlay = document.getElementById(`${idBase}_mOverlay`);

    if (elOverlay) {
      document.body.removeChild(elOverlay);
    }
  });
}

/**
 * Shortcut function to create and return a DOM element
 */
function domEl(tag: string, attributes: { [key: string]: any } = {}, children: any[] = []) {
  const el = document.createElement(tag);

  for (const attr in attributes) {
    if (attr === 'text') {
      el.appendChild(document.createTextNode(attributes[attr]));
      continue;
    }
    if (attr === 'html') {
      el.innerHTML = attributes[attr];
      continue;
    }
    if (attr === 'style') {
      el.setAttribute('style', styleToString(attributes[attr]));
      continue;
    }
    if (attributes.hasOwnProperty(attr)) {
      el.setAttribute(attr, attributes[attr]);
    }
  }

  const fragment = document.createDocumentFragment();

  children.forEach((child) => {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    fragment.appendChild(child);
  });

  el.appendChild(fragment);

  return el;
}

function styleToString(style: any) {
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() +
      ':' +
      style[key] +
      ';',
    ''
  );
}
