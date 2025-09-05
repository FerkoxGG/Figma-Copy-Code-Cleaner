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
  lang: z.enum(['text', 'html', 'css', 'js']).default('text').describe('The language of the code to be cleaned.'),
});
export type CleanCodeFromFigmaInput = z.infer<typeof CleanCodeFromFigmaInputSchema>;

const CleanCodeFromFigmaOutputSchema = z.object({
  cleanedCode: z.string().describe('The cleaned code, ready for use.'),
});
export type CleanCodeFromFigmaOutput = z.infer<typeof CleanCodeFromFigmaOutputSchema>;

export async function cleanCodeFromFigma(input: CleanCodeFromFigmaInput): Promise<CleanCodeFromFigmaOutput> {
  return cleanCodeFromFigmaFlow(input);
}

const cleanCodeFromFigmaFlow = ai.defineFlow(
  {
    name: 'cleanCodeFromFigmaFlow',
    inputSchema: CleanCodeFromFigmaInputSchema,
    outputSchema: CleanCodeFromFigmaOutputSchema,
  },
  async (input) => {
    let cleanedCode = input.figmaCode
      // 1. Invisibles/Control
      .replace(/[\u00A0\u2000-\u200D\u2060\uFEFF]/g, ' ')
      .replace(/[\u2028\u2029]/g, '')
      // 2. Line Breaks
      .replace(/\r\n|\r/g, '\n')
      // 3. Typographic Punctuation
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—−]/g, '-')
      .replace(/…/g, '...')
      .replace(/×/g, '*');

    // 4. Spaces and language-specific rules
    const lines = cleanedCode.split('\n');
    const processedLines = lines.map(line => {
      const indentMatch = line.match(/^\s*/);
      const indentation = indentMatch ? indentMatch[0] : '';
      let content = line.trimStart();
      
      // Trim trailing spaces
      content = content.trimEnd();

      if (input.lang === 'html' || input.lang === 'text') {
        // Collapse internal spaces
        content = content.replace(/\s{2,}/g, ' ');
      }
      
      let processedLine = indentation + content;

      if (input.lang === 'html') {
        // Specific HTML rules
        processedLine = processedLine.replace(/<([a-zA-Z0-9]+)\s+([^>]*?)>/g, (match, tagName, attrs) => {
            let newAttrs = attrs.replace(/([a-zA-Z-]+)=(['"]?)(.*?)\2/g, (attrMatch, name, quote, value) => {
                let newValue = value;
                if (name.toLowerCase() === 'target') {
                    newValue = '_blank';
                }
                return `${name}="${newValue}"`;
            });
            return `<${tagName} ${newAttrs}>`;
        });
        processedLine = processedLine.replace(/(<a[^>]*>)<\/span>(\s*<svg)/g, '$1$2');
      }

      return processedLine;
    });

    cleanedCode = processedLines.join('\n');

    return { cleanedCode };
  }
);
