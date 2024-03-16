import { useState } from "react";
import "./App.css";
import Hero from "./Hero/Hero";
import KeysSection from "./Keys/Keys";
import Navbar from "./Navbar/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { getAuthCookie } from "../utils/helper";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:6789/api",
          async headers() {
            return {
              authorization: getAuthCookie(),
            };
          },
        }),
      ],
    })
  );


  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Navbar />
          <Hero />
          <KeysSection />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
