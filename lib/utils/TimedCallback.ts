interface CallsProps {
  timeout: number;
  callback: () => void;
  onRepated?: () => void;
  timeoutId: any;
}
export default class TimedCallback {
  static Calls: { [id: string]: CallsProps } = {};
  static alreadyPending = (id: string) => !!this.Calls[id]?.timeoutId;
  static restart = ({ id, timeout }: { id: string; timeout: number }) => {
    this.Calls[id]?.onRepated?.();
    clearTimeout(this.Calls[id].timeoutId);
    this.Calls[id].timeoutId = setTimedCallBack({ id, timeout });
  };
  static remove = (id: string) => {
    if (this.alreadyPending(id)) {
      clearTimeout(this.Calls[id].timeoutId);
      delete this.Calls[id];
    }
  };
  static create = ({ id, timeout, callback, onRepated }: any) => {
    this.remove(id);
    this.Calls[id] = {
      callback,
      timeout,
      onRepated,
      timeoutId: setTimedCallBack({ id, timeout }),
    };
  };
}
const setTimedCallBack = ({ id, timeout }: any) => {
  return setTimeout(() => {
    TimedCallback.Calls[id].callback();
    delete TimedCallback.Calls[id];
  }, timeout);
};
