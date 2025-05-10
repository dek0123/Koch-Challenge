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
        api_key="API_KEY" 
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
