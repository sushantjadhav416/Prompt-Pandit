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
    const { goal, context, audience, outputType, aiModel, tone, length } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating prompt with params:", { goal, context, audience, outputType, aiModel, tone, length });

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

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
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
