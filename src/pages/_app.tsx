import "../styles/globals.css"; // Ensure your styles are imported
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
};

export default MyApp;
