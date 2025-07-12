import "./global.css";
import { ThemeProvider } from "./custom-components/theme-provider";
import Navbar from "./custom-components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import AvatarManager from "./custom-components/AvatarManager";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthContextProvider>
          <AvatarManager />
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
            <Toaster position="bottom-right" reverseOrder={false} />
            {children}
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
