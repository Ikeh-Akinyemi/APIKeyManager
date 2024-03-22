import { useState } from "react";
import "./App.css";
import Hero from "./Hero/Hero";
import KeysSection from "./Keys/Keys";
import Navbar from "./Navbar/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { getAuthCookie } from "../utils/helper";
import KeyExpiryAlerts from "./Alert/Toaster";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // call subscriptions through websockets and the rest over http
        splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client: createWSClient({
              url: "ws://localhost:6789/api",
            }),
          }),
          false: httpBatchLink({
            url: "http://localhost:6789/api",
            async headers() {
              return {
                authorization: `Bearer ${getAuthCookie()}`,
              };
            },
          }),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Navbar />
          <KeyExpiryAlerts />
          <ToastContainer />
          <Hero />
          <KeysSection />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
