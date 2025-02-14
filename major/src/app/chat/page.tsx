// app/chat/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetchFromAPI } from "@/lib/utils"; // Assuming fetchFromAPI is defined in lib/api.ts
import ReactMarkdown from "react-markdown"; // Import react-markdown

export default function Chat() {
    const [prompt, setPrompt] = useState<string>("");
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt) return;

        setIsLoading(true);
        try {
            // Using fetchFromAPI function to send the request
            const data = await fetchFromAPI("/hospital-prompt", {
                method: "POST",
                body: JSON.stringify({ prompt }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setResponse(data.result); // Assuming the response has a 'result' field with markdown content
        } catch (error) {
            console.error("Error fetching response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <Input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask your question here" className="w-full" />
                <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Send"}
                </Button>
            </form>

            {response && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Response:</h2>
                    <div className="prose prose-invert mt-4">
                        {/* Render the markdown response using react-markdown */}
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
