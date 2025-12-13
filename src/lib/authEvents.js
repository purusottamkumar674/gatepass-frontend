export const AUTH_EVENTS = {
  SESSION_EXPIRED: "SESSION_EXPIRED",
};

export const emitAuthEvent = (event) => {
  window.dispatchEvent(new CustomEvent(event));
};

