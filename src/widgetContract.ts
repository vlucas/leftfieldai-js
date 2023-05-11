'use client';

import { ENV_IS_CLIENT, LFAI_HOST } from './widgetConst';
import mitt from 'mitt';

export type TFrameMessage = {
  evName: string;
  evData: any;
};

const emitter = mitt();

function ensureFrameExists(frame: Window) {
  if (!ENV_IS_CLIENT) {
    throw new Error('This code must be run on the client.');
  }

  if (!frame || typeof frame.postMessage === 'undefined') {
    throw new Error('[LFAI_Widget] Frame reference not found!');
  }
}

/**
 * Postmessage stuff
 */
export async function sendFrameMessage(frame: Window, evName: string, evData: any) {
  ensureFrameExists(frame);
  const data: TFrameMessage = { evName, evData };

  frame.postMessage(data);
}
export async function sendParentFrameMessage(evName: string, evData: any) {
  const data = { evName, evData };

  if (!window.parent) {
    return;
  }

  window.parent.postMessage(data);
}

/**
 * Opener/parent frame
 */
export async function widgetFrameHandshake(frame: Window) {
  if (!frame || typeof frame.postMessage === 'undefined') {
    console.error('[LFAI_Widget] Unable to send handshake message to frame!');
    return;
  }

  frame.postMessage({ evName: 'lfai_handshake', evData: null });

  window.addEventListener('message', (e) => {
    if (!e.origin.includes(LFAI_HOST)) return;

    const msg: TFrameMessage = e.data;

    emitter.emit(msg.evName, msg.evData);
  });
}

/**
 * Listen to frame event for widget
 */
export async function widgetOnFrameEvent(evName: string, fn: (evData: any) => void) {
  emitter.on(evName, fn);
}
