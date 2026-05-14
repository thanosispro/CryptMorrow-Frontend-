import "@/styles/globals.css";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import Toast from "../components/Toast";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <Toast />
          <div key={router.asPath} className="page-transition">
            <Component {...pageProps} />
          </div>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  );
}
