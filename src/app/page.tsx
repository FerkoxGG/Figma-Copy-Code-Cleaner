"use client";

import { useState } from "react";
import { cleanCodeFromFigma } from "@/ai/flows/clean-code-from-figma-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, ClipboardCheck, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const [figmaCode, setFigmaCode] = useState("");
  const [cleanedCode, setCleanedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCleanCode = async () => {
    if (!figmaCode.trim()) {
      toast({
        title: "Input is empty",
        description: "Please paste some code to clean.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setCleanedCode("");
    setIsCopied(false);
    try {
      const result = await cleanCodeFromFigma({ figmaCode });
      setCleanedCode(result.cleanedCode);
    } catch (error) {
      console.error("Error cleaning code:", error);
      toast({
        title: "Error",
        description: "Failed to clean the code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!cleanedCode) return;
    navigator.clipboard.writeText(cleanedCode);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "The cleaned code has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
              Code Cleaner
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Paste your messy code from Figma. Instantly get a clean, developer-friendly version.
            </p>
          </header>

          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleCleanCode}
              disabled={isLoading || !figmaCode.trim()}
              className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent-foreground shadow-md transition-transform active:scale-95 text-base font-semibold px-8 py-6 rounded-full"
              aria-label="Clean the code"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Cleaning...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Clean My Code
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="shadow-lg rounded-xl border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl font-semibold">
                  <span>Messy Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your code from Figma here..."
                  value={figmaCode}
                  onChange={(e) => setFigmaCode(e.target.value)}
                  className="h-80 resize-none font-code text-sm bg-card border-input focus-visible:ring-primary"
                  aria-label="Code input from Figma"
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl border relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl font-semibold">
                  <span>Cleaned Code</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    disabled={!cleanedCode || isLoading}
                    className="hover:bg-primary/10 rounded-full"
                    aria-label="Copy cleaned code"
                  >
                    {isCopied ? (
                      <ClipboardCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clipboard className="h-5 w-5" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    placeholder="Your cleaned code will appear here..."
                    value={cleanedCode}
                    readOnly
                    className="h-80 resize-none font-code text-sm bg-card border-input focus-visible:ring-primary"
                    aria-label="Cleaned code output"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
