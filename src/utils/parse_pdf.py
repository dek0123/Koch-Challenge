from megaparse.parser.megaparse_vision import MegaParseVision
from langchain_openai import ChatOpenAI
import os
import asyncio
from pathlib import Path

async def process_file_async(parser, file_path):
    return await parser.aconvert(file_path, batch_size=2)
def process_file(parser, file_path):
    return asyncio.run(process_file_async(parser, file_path))

def write_md(output_file_path, response):
    with open(output_file_path, "w+", encoding="utf-8") as f:
        f.write(response)

def process_response(response):
    text_blocks = response.content  
    combined_text = "\n\n".join(block.text for block in text_blocks)
    return combined_text

def parse(input_file_path: str, output_file_path: str):
    """
    parse pdf file to markdown

    Args:
        input_file: str  path to file
        output_file: str path to store the md file
    """
    if Path(input_file_path).suffix.lower() != ".pdf":
        raise ValueError("Only PDF files are supported.")

    model = ChatOpenAI(
    openai_api_key="YOUR_API_KEY",
    openai_api_base="https://openrouter.ai/api/v1",
    model_name="gpt-4o",
    )
    parser = MegaParseVision(model)
    response = process_file(parser, input_file_path)
    write_md(output_file_path, process_response(response))
    return output_file_path
