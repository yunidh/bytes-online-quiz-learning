import "./global.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <NextTopLoader
              showSpinner={false}
              color="hsl(262.1 83.3% 57.8%)"
              height={4}
            />
            {children}
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
