import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home } from "./pages/Home";
import { PromptWizard } from "./pages/PromptWizard";
import { Templates } from "./pages/Templates";
import { PromptRewriter } from "./pages/PromptRewriter";
import { Auth } from "./pages/Auth";
import { MyPrompts } from "./pages/MyPrompts";
import { Documentation } from "./pages/Documentation";
import { Guides } from "./pages/Guides";
import { AdminTemplates } from "./pages/AdminTemplates";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/wizard" element={<ProtectedRoute><PromptWizard /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
              <Route path="/rewriter" element={<ProtectedRoute><PromptRewriter /></ProtectedRoute>} />
              <Route path="/my-prompts" element={<ProtectedRoute><MyPrompts /></ProtectedRoute>} />
              <Route path="/admin/templates" element={<ProtectedRoute><AdminTemplates /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
