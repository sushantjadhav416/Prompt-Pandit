import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalPrompt, role, context, tone, outputFormat } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Construct the system prompt for rewriting
    const systemPrompt = `You are an expert prompt engineer specializing in improving and optimizing prompts for AI systems. Your task is to rewrite prompts to make them clearer, more specific, and more effective.

When rewriting prompts, you should:
1. Enhance clarity and specificity
2. Add relevant context that improves understanding
3. Structure the prompt for optimal AI comprehension
4. Incorporate the specified role/persona perspective
5. Adjust the tone as requested
6. Format the output appropriately

Provide ONLY the rewritten prompt without any explanations or meta-commentary.`;

    // Construct the user prompt
    const userPrompt = `Rewrite the following prompt with these specifications:

Original Prompt: "${originalPrompt}"

Role/Persona: ${role}
Additional Context: ${context || "None specified"}
Desired Tone: ${tone}
Output Format: ${outputFormat}

Please rewrite this prompt to be more effective, incorporating the role perspective, adding context-aware improvements, and adjusting the tone as specified.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required. Please add credits to your workspace.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rewrittenPrompt = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        rewrittenPrompt,
        metadata: {
          originalLength: originalPrompt.length,
          rewrittenLength: rewrittenPrompt.length,
          model: 'google/gemini-2.5-flash'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in rewrite-prompt function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});