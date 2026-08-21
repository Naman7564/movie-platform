import re
from urllib.parse import parse_qs, urlparse

def extract_youtube_video_id(url: str) -> str:
    """
    Extract YouTube video ID from various YouTube URL formats.
    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    - https://m.youtube.com/watch?v=VIDEO_ID
    """
    if not url:
        return ""

    url = url.strip()

    # Check if raw 11-character video ID is passed directly
    if re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url

    parsed = urlparse(url)
    hostname = parsed.hostname or ""

    if "youtu.be" in hostname:
        return parsed.path.lstrip("/").split("?")[0].split("/")[0]

    if "youtube.com" in hostname or "youtube-nocookie.com" in hostname:
        if parsed.path.startswith("/watch"):
            query_params = parse_qs(parsed.query)
            return query_params.get("v", [""])[0]
        if parsed.path.startswith("/embed/"):
            return parsed.path.split("/embed/")[1].split("?")[0].split("/")[0]
        if parsed.path.startswith("/shorts/"):
            return parsed.path.split("/shorts/")[1].split("?")[0].split("/")[0]
        if parsed.path.startswith("/v/"):
            return parsed.path.split("/v/")[1].split("?")[0].split("/")[0]

    # Regex fallback
    match = re.search(r'(?:v=|\/embed\/|\/shorts\/|\/v\/|youtu\.be\/|\/watch\?v=|\/watch\?.+&v=)([\w-]{11})', url)
    if match:
        return match.group(1)

    return ""
