"""Shared Jina layer for the fabric reflexes — embeddings + rerank.

GOTCHA (discovered 2026-07-23): api.jina.ai sits behind Cloudflare, which 403/1010-blocks
python-urllib's default User-Agent as a bot. We send a curl UA so the fabric's Jina calls
succeed. Key is read from ~/.config/mym-autotrader/secrets.env (JINA_API_KEY), never hardcoded.
Import this from any reflex (W1 etc.) instead of re-implementing the HTTP call.
"""
import json
from pathlib import Path
from urllib import request, error

SECRETS = Path.home() / ".config/mym-autotrader/secrets.env"
EMBED_URL = "https://api.jina.ai/v1/embeddings"
RERANK_URL = "https://api.jina.ai/v1/rerank"
_UA = "curl/8.7.1"   # non-default UA to clear Jina's Cloudflare WAF


def _key():
    try:
        for line in SECRETS.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("JINA_API_KEY=") and line.split("=", 1)[1].strip():
                return line.split("=", 1)[1].strip().strip("'\"")
    except OSError:
        pass
    return None


def _post(url, payload):
    key = _key()
    if not key:
        return None, "missing-key"
    try:
        req = request.Request(
            url, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "User-Agent": _UA},
            method="POST")
        with request.urlopen(req, timeout=45) as r:
            if r.status != 200:
                return None, f"http-{r.status}"
            return json.loads(r.read().decode("utf-8")), "ok"
    except error.HTTPError as e:
        return None, f"http-{e.code}"
    except Exception as e:
        return None, f"{type(e).__name__}"


def embed(texts, model="jina-embeddings-v3", batch=75):
    """Return (list_of_vectors, 'ok') or (None, reason)."""
    out = []
    for i in range(0, len(texts), batch):
        body, st = _post(EMBED_URL, {"model": model, "input": texts[i:i + batch]})
        if st != "ok":
            return None, st
        out.extend(d["embedding"] for d in body.get("data", []))
    return (out, "ok") if len(out) == len(texts) else (None, "count-mismatch")


def rerank(query, docs, model="jina-reranker-v2-base-multilingual", top_n=None):
    """Return (list_of_(doc_index, score), 'ok') or (None, reason)."""
    body, st = _post(RERANK_URL, {"model": model, "query": query, "documents": docs, "top_n": top_n or len(docs)})
    if st != "ok":
        return None, st
    return [(r["index"], r["relevance_score"]) for r in body.get("results", [])], "ok"


if __name__ == "__main__":
    v, s = embed(["fade the quarter-figure", "lock profit after TP1"])
    print("embed:", s, "dims:", (len(v[0]) if v else None))
    r, s2 = rerank("profit lock rule", ["dead breakeven after TP1", "unrelated text about coffee"])
    print("rerank:", s2, r)
