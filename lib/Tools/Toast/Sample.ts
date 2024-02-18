import Toast from "./Toast";

interface actionChild {
  action: "default" | "info" | "success" | "warn" | "error" | "primary" | "secondary";
  title: string;
  content: string;
}

export const ToastActions: actionChild[] = [
  { action: "default", title: "الافتراضي", content: "اهلا بك اخي العميل" },
  { action: "info", title: "معلومة", content: "يوجد تحديث جديد" },
  { action: "success", title: "تم الحفظ", content: "تم حفظ البيانات بنجاح" },
  { action: "warn", title: "تحذير", content: "هنالك بيانات لم ترفع" },
  { action: "error", title: "خطأ", content: "لم يتم رفع البيانات" },
  { action: "primary", title: "مرحبا", content: "اهلا بك " },
  { action: "secondary", title: "تحديث", content: "يوجد تحديث جديد" },
];

export const testToast = () => {
  let toastkey = 0;
  const { action, title, content } = (ToastActions as any)[toastkey];
  (Toast as any)[action]({
    title,
    content,
    timeout: 10_000 * Math.random(),
  });

  setInterval(() => {
    toastkey = (toastkey + 1) % ToastActions.length;
    const { action, title, content } = (ToastActions as any)[toastkey];
    (Toast as any)[action]({
      title,
      content,
      timeout: 10_000 * Math.random(),
    });
  }, 2_000);

  // const testToastNow = () => {
  //   setTimeout(() => {
  //     (Toast as any)[(ToastActions as any)[toastkey]]({
  //       ...ToastSamples[toastkey],
  //       timeout: 4_000,
  //     });
  //   }, 0);

  //   setTimeout(() => {
  //     toastkey = (toastkey + 1) % ToastActions.length;
  //     const { action, title, content } = (ToastActions as any)[toastkey];
  //     (Toast as any)[action]({
  //       title,
  //       content,
  //       timeout: 2_000,
  //     });
  //   }, 1000);
  //   setTimeout(() => {
  //     toastkey = (toastkey + 1) % ToastActions.length;
  //     const { action, title, content } = (ToastActions as any)[toastkey];
  //     (Toast as any)[action]({
  //       title,
  //       content,
  //       timeout: 3_000,
  //     });
  //   }, 3000);
  // };

  // testToastNow()
  // setInterval(() => {
  //   testToastNow()
  // }, 5000)
};
