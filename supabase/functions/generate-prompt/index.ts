import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation helper
const validateInput = (data: any) => {
  const errors: string[] = [];
  
  if (!data.goal || typeof data.goal !== 'string' || data.goal.length === 0 || data.goal.length > 1000) {
    errors.push('goal must be 1-1000 characters');
  }
  if (data.context && (typeof data.context !== 'string' || data.context.length > 2000)) {
    errors.push('context must be max 2000 characters');
  }
  if (!data.audience || typeof data.audience !== 'string' || data.audience.length === 0 || data.audience.length > 500) {
    errors.push('audience must be 1-500 characters');
  }
  if (!data.outputType || typeof data.outputType !== 'string' || data.outputType.length === 0 || data.outputType.length > 100) {
    errors.push('outputType must be 1-100 characters');
  }
  if (!data.aiModel || typeof data.aiModel !== 'string' || data.aiModel.length === 0 || data.aiModel.length > 100) {
    errors.push('aiModel must be 1-100 characters');
  }
  if (!data.tone || typeof data.tone !== 'string' || data.tone.length === 0 || data.tone.length > 100) {
    errors.push('tone must be 1-100 characters');
  }
  if (!data.length || typeof data.length !== 'string' || data.length.length === 0 || data.length.length > 100) {
    errors.push('length must be 1-100 characters');
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
    
    // Check if streaming is requested
    const useStreaming = requestData.stream === true;
    
    const validationErrors = validateInput(requestData);
    
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { goal, context, audience, outputType, aiModel, tone, length } = requestData;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating prompt with params:", { goal, context, audience, outputType, aiModel, tone, length, streaming: useStreaming });

    // Build the system prompt for generating the optimized prompt
    const systemPrompt = `You are an expert AI prompt engineer. Your task is to generate highly optimized, effective prompts based on user requirements. 
    
Create a detailed, well-structured prompt that:
- Clearly defines the goal and desired outcome
- Includes relevant context and constraints
- Specifies the target audience and their needs
- Defines the expected output format
- Sets the appropriate tone and style
- Is optimized for the ${aiModel} model
- Has appropriate length (${length})

Return ONLY the generated prompt text without any explanations or meta-commentary.`;

    const userPrompt = `Generate an optimized AI prompt with these specifications:

Goal: ${goal}
Context: ${context || 'Not specified'}
Target Audience: ${audience}
Output Type: ${outputType}
AI Model: ${aiModel}
Tone: ${tone}
Length: ${length}

Create a complete, ready-to-use prompt that incorporates all these elements effectively.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        stream: useStreaming,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
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
        { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle streaming response
    if (useStreaming) {
      console.log("Streaming response to client");
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        },
      });
    }

    // Handle non-streaming response (fallback)
    const data = await response.json();
    const generatedPrompt = data.choices[0].message.content;

    console.log("Successfully generated prompt");

    return new Response(
      JSON.stringify({ 
        prompt: generatedPrompt,
        metadata: {
          model: aiModel,
          outputType,
          tone,
          length
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error in generate-prompt function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request. Please try again." }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
