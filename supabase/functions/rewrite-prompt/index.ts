import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation helper
const validateInput = (data: any) => {
  const errors: string[] = [];
  
  if (!data.originalPrompt || typeof data.originalPrompt !== 'string' || data.originalPrompt.length === 0 || data.originalPrompt.length > 5000) {
    errors.push('originalPrompt must be 1-5000 characters');
  }
  if (!data.role || typeof data.role !== 'string' || data.role.length === 0 || data.role.length > 200) {
    errors.push('role must be 1-200 characters');
  }
  if (data.context && (typeof data.context !== 'string' || data.context.length > 2000)) {
    errors.push('context must be max 2000 characters');
  }
  if (!data.tone || typeof data.tone !== 'string' || data.tone.length === 0 || data.tone.length > 100) {
    errors.push('tone must be 1-100 characters');
  }
  if (!data.outputFormat || typeof data.outputFormat !== 'string' || data.outputFormat.length === 0 || data.outputFormat.length > 100) {
    errors.push('outputFormat must be 1-100 characters');
  }
  
  return errors;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData = await req.json();
    const validationErrors = validateInput(requestData);
    
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { originalPrompt, role, context, tone, outputFormat } = requestData;

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
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      const ERROR_MESSAGES: { [key: number]: string } = {
        429: 'Service is busy. Please try again shortly.',
        402: 'Service unavailable. Please contact support.',
        400: 'Invalid request. Please check your input.',
        500: 'Service temporarily unavailable. Please try again.'
      };
      
      const statusCode = response.status >= 500 ? 500 : response.status;
      const errorMessage = ERROR_MESSAGES[response.status] || 'Unable to process request. Please try again.';
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
        error: 'An error occurred processing your request. Please try again.' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});