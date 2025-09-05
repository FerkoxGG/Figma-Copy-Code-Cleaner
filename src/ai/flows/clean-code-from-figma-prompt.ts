'use server';

/**
 * @fileOverview Cleans code pasted from Figma by replacing problematic characters and normalizing whitespace.
 *
 * - cleanCodeFromFigma - A function that takes Figma code as input and returns cleaned code.
 * - CleanCodeFromFigmaInput - The input type for the cleanCodeFromFigma function.
 * - CleanCodeFromFigmaOutput - The return type for the cleanCodeFromFigma function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CleanCodeFromFigmaInputSchema = z.object({
  figmaCode: z
    .string()
    .describe('The code extracted from Figma that needs to be cleaned.'),
});
export type CleanCodeFromFigmaInput = z.infer<typeof CleanCodeFromFigmaInputSchema>;

const CleanCodeFromFigmaOutputSchema = z.object({
  cleanedCode: z.string().describe('The cleaned code, ready for use.'),
});
export type CleanCodeFromFigmaOutput = z.infer<typeof CleanCodeFromFigmaOutputSchema>;

export async function cleanCodeFromFigma(input: CleanCodeFromFigmaInput): Promise<CleanCodeFromFigmaOutput> {
  return cleanCodeFromFigmaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cleanCodeFromFigmaPrompt',
  input: {schema: CleanCodeFromFigmaInputSchema},
  output: {schema: CleanCodeFromFigmaOutputSchema},
  prompt: `You are a code cleaning expert. Your task is to clean code extracted from Figma.

You will receive a block of text that may contain the following issues:
- invisible spaces (non-breaking space, BOM, etc.)
- typographer's quotes (“ ” ‘ ’)
- typographer's dashes (– — −)
- ellipsis character (…)
- typographer's multiplication character (×)
- inconsistent line breaks (\r, \r\n)

Replace these characters with their programming-safe equivalents:
- invisible spaces -> normal space
- “ ” -> "
- ‘ ’ -> '
- – — − -> -
- … -> ...
- × -> *
- Normalize line breaks to \n
Remove double spaces and trailing whitespace from each line.

Return the cleaned text without adding any explanations or modifications beyond the specified cleaning.
Maintain the original indentation and code structure.

Input:
{{figmaCode}}

Output:`,
});

const cleanCodeFromFigmaFlow = ai.defineFlow(
  {
    name: 'cleanCodeFromFigmaFlow',
    inputSchema: CleanCodeFromFigmaInputSchema,
    outputSchema: CleanCodeFromFigmaOutputSchema,
  },
  async input => {
    // Perform character replacements and whitespace cleanup
    let cleanedCode = input.figmaCode
      .replace(/\u00A0|\uFEFF/g, ' ') // Invisible spaces
      .replace(/[“”]/g, '"') // Typographer's quotes
      .replace(/[‘’]/g, "'") // Typographer's quotes
      .replace(/[–—−]/g, '-') // Typographer's dashes
      .replace(/…/g, '...') // Ellipsis
      .replace(/×/g, '*') // Multiplication character
      .replace(/\r\n|\r/g, '\n') // Line endings
      .split('\n')
      .map(line => line.replace(/  +/g, ' ').trimEnd())
      .join('\n');

    return {cleanedCode};
  }
);
