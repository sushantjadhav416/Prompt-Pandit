import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home } from "./pages/Home";
import { PromptWizard } from "./pages/PromptWizard";
import { Templates } from "./pages/Templates";
import { PromptRewriter } from "./pages/PromptRewriter";
import { Auth } from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wizard" element={<PromptWizard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/rewriter" element={<PromptRewriter />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-prompts" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-2">My Prompts</h1><p className="text-muted-foreground">Coming soon...</p></div></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
