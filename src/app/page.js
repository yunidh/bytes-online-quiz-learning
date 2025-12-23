import Header from "./custom-components/landing_page/Header";
import Elements from "./custom-components/landing_page/Elements";
import Cards from "./custom-components/landing_page/Cards";
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
            <div className="flex flex-col sm:flex-row mt-20 sm:mt-40 justify-start">
              <Cards />
            </div>
          </AuthContextProvider>
        </div>
      </div>
    </main>
  );
}
