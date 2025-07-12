import Image from "next/image";
import Header from "./components/landing_page/Header";
import AboutSection from "./components/landing_page/AboutSection";
import background from "../../public/image/background2.jpg";
import Elements from "./components/landing_page/Elements";
import Cards from "./components/landing_page/Cards";
import Connect from "./components/landing_page/Connect";
import "./global.css";
import { AuthContextProvider } from "./context/AuthContext";

export const metadata = {
  title: "Bytes",
  description: "",
};

export default function Home() {
  return (
    <main className="aboutPage flex flex-col items-center justify-between">
      <div className="relative w-full">
        <div className="container mt-6 sm:mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-5">
          <AuthContextProvider>
            <Header />
            <AboutSection />
            <Elements />
            <div className="flex flex-col sm:flex-row mt-20 sm:mt-40 justify-start">
              <Cards />
            </div>

            <Connect />
          </AuthContextProvider>
        </div>
      </div>
    </main>
  );
}
