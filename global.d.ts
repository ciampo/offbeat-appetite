interface Window {
  IS_GA_INIT?: boolean;
  navigator?: { share?: (data?: ShareData) => Promise<void> };
}

type ShareOptions = { title: string; text: string; url: string };

type NavigatorShare = (options: ShareOptions) => Promise<{}>;

interface Navigator {
  share?: NavigatorShare;
}
