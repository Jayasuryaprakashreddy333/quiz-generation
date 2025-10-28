# scraper.py
import requests
from bs4 import BeautifulSoup
import re
import html
from urllib.parse import unquote
from typing import Tuple


# extract title from wikipedia url
def _extract_title_from_url(url: str) -> str:
    if "/wiki/" in url:
        title = url.split("/wiki/")[-1]
        title = title.split("#")[0]
        return unquote(title).replace("_", " ")
    return url

def fetch_wikipedia_text(url: str, paragraphs: int = 1) -> Tuple[str, str]:
    """
    Return the extracted content from wiki url by using BeautifulSoup
    """
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
    response = requests.get(url, headers=headers)
    print(response.status_code)
    soup = BeautifulSoup(response.content, "html.parser")
    para_tags = soup.select("p")
    text = " ".join([p.get_text() for p in para_tags])
    title = _extract_title_from_url(url)
    return  title, text

def clean_text(text: str) -> str:
    """
    clean the extracted text from wikipedia
    """
    # decode HTML utf-8 characters
    text = html.unescape(text)

    # remove references like [1], [c], [note], [citation needed]
    text = re.sub(r"\[[^\]]*\]", " ", text)

    # remove parentheses content that looks like transliteration/pronunciation if desired
    # keep only short parentheses? for now remove reasonable length parentheses (<=200 chars)
    text = re.sub(r"\([^)]{0,200}\)", " ", text)

    # replace various dashes with hyphen
    text = text.replace("—", " - ").replace("–", " - ")

    # remove backslashes and escaped quotes
    text = text.replace("\\", "")

    # remove zero width and control chars
    text = re.sub(r"[\u200b\u200c\u200d\uFEFF]", "", text)

    # collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # limit length
    return text
