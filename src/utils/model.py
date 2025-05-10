from openai import OpenAI
import os
def response(input, prompt=None, model="openai/o3-mini"):
    """get response of LLM 

    Args:
        input : context: str
        prompt : instructions for LLM

    Returns:
        response of the LLM to the prompt
    """
    
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",    
        api_key="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" 
    )

    combined_input = f"{prompt}\n\n---\n\n{input}"

    
    completion = client.chat.completions.create(
        model=model,
        # model="google/gemini-2.5-pro-preview",
        messages=[
            {
                "role": "user",
                "content": combined_input
            }
        ],
        temperature=0
    )
    return completion.choices[0].message.content
