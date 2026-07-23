#!/usr/bin/env python3
"""
Local InfraNodus-style gap miner.

Method map: concept extraction -> co-occurrence graph -> community detection ->
betweenness bridges -> structural gap ranking, plus optional Jina semantic edges.

Deps belong here:
  /Users/leonardofibonacci/.claude/fabric/.venv/bin/pip install networkx numpy python-louvain
"""
from __future__ import annotations
import json, re, sys
from collections import Counter, defaultdict
from datetime import date
from itertools import combinations
from pathlib import Path
from urllib import error, request

try:
    import networkx as nx
    import numpy as np
    from networkx.algorithms.community.quality import modularity
except ImportError as exc:
    print("Missing dependency. Install into the dedicated venv with: /Users/leonardofibonacci/.claude/fabric/.venv/bin/pip install networkx numpy python-louvain", file=sys.stderr)
    raise SystemExit(2) from exc

DEFAULT_CORPUS_DIRS = [Path("/Users/leonardofibonacci/code/projects/mym-autotrader/vault/02-strategies"), Path("/Users/leonardofibonacci/code/projects/mym-autotrader/vault/03-failed-research")]
REPORT_DIR = Path("/Users/leonardofibonacci/code/projects/mym-autotrader/vault/07-opportunity-pipeline")
SECRETS_FILE = Path("/Users/leonardofibonacci/.config/mym-autotrader/secrets.env")
JINA_URL = "https://api.jina.ai/v1/embeddings"
TOP_CONCEPTS, TOP_EMBED_CONCEPTS, WINDOW = 400, 150, 4
SEMANTIC_THRESHOLD, TOP_COMMUNITIES, TOP_BRIDGES, TOP_GAPS = 0.60, 8, 15, 5
TOKEN_RE = re.compile(r"[a-z0-9][a-z0-9_'/-]*[a-z0-9]")
SHORT_KEEP = {"ai", "ml", "llm", "w2", "w5", "adx", "rsi", "vix"}
STOPWORDS = set("a about above after again against all am an and any are arent as at be because been before being below between both but by can cant cannot could couldnt did didnt do does doesnt doing dont down during each few for from further had hadnt has hasnt have havent having he hed hell her here heres hers herself hes him himself his how hows i id ill im ive if in into is isnt it its itself lets me more most mustnt my myself no nor not of off on once only or other ought our ours ourselves out over own same shant she shed shell shes should shouldnt so some such than that thats the their theirs them themselves then there theres these they theyd theyll theyre theyve this those through to too under until up very was wasnt we wed well were weve werent what whats when whens where wheres which while who whos whom why whys with wont would wouldnt you youd youll youre youve your yours yourself yourselves also just like get got use used using make makes made may might many much one two three first second new old good bad high low best better across via per every within without onto whose will shall".split())

def warn(message): print(f"WARNING: {message}", file=sys.stderr)
def tokenize(text): return [m.group(0).strip("_'/-") for m in TOKEN_RE.finditer(text.lower())]  # lower BEFORE regex: the [a-z0-9] class was truncating the first char of capitalized tokens (Area61->rea61)
def meaningful(token): return bool(token) and token not in STOPWORDS and any(ch.isalpha() for ch in token) and (len(token) >= 3 or token in SHORT_KEEP)  # require a letter: drops pure dates/numbers (2026-07-17, 12, 30) while keeping alnum terms (us30, m2k, v2)

def read_corpus(roots):
    docs = []
    for root in roots:
        if not root.exists():
            warn(f"missing corpus directory, skipped: {root}")
            continue
        for path in sorted(root.rglob("*")):
            if not (path.is_file() and path.suffix.lower() in {".md", ".txt"}):
                continue
            try:
                docs.append((str(path), tokenize(path.read_text(encoding="utf-8", errors="ignore"))))
            except OSError as exc:
                warn(f"could not read {path}: {exc}")
    return docs

def extract_concepts(docs):
    """Stage 1: meaningful unigrams and adjacent non-stopword bigrams with doc provenance."""
    freq, provenance, by_doc = Counter(), defaultdict(set), {}
    for doc_id, tokens in docs:
        terms = [(i, t) for i, t in enumerate(tokens) if meaningful(t)]
        by_doc[doc_id] = terms
        for _, term in terms:
            freq[term] += 1
            provenance[term].add(doc_id)
        for (_, left), (_, right) in zip(terms, terms[1:]):
            bigram = f"{left} {right}"
            freq[bigram] += 1
            provenance[bigram].add(doc_id)
    return freq, provenance, by_doc

def build_graph(concepts, freq, provenance, by_doc):
    """Stages 2-3: top concepts as nodes, original-token window co-occurrence as edges."""
    graph = nx.Graph()
    for term in concepts:
        graph.add_node(term, frequency=freq[term], docs=len(provenance.get(term, ())))
    for terms in by_doc.values():
        occ = [(i, term) for i, term in terms if term in concepts]
        occ += [(i, f"{left} {right}") for (i, left), (_, right) in zip(terms, terms[1:]) if f"{left} {right}" in concepts]
        occ.sort(key=lambda item: item[0])
        for i, (pos_a, term_a) in enumerate(occ):
            for pos_b, term_b in occ[i + 1:]:
                if pos_b - pos_a > WINDOW:
                    break
                if term_a == term_b:
                    continue
                if graph.has_edge(term_a, term_b):
                    graph[term_a][term_b]["weight"] += 1
                else:
                    graph.add_edge(term_a, term_b, weight=1, edge_type="cooccurrence")
    return graph

def read_jina_key():
    try:
        for raw in SECRETS_FILE.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                if key.strip() == "JINA_API_KEY" and value.strip():
                    return value.strip().strip("'\"")
    except OSError:
        pass
    return None

def jina_embeddings(terms):
    """Jina upgrade: batch-embed high-signal concepts; all failures are non-fatal."""
    key = read_jina_key()
    if not key:
        return [], "degraded:missing-key"
    vectors = []
    try:
        for start in range(0, len(terms), 75):
            payload = json.dumps({"model": "jina-embeddings-v3", "input": terms[start:start + 75]}).encode()
            req = request.Request(JINA_URL, data=payload, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "User-Agent": "curl/8.7.1"}, method="POST")
            with request.urlopen(req, timeout=45) as res:
                if res.status != 200:
                    return [], f"degraded:http-{res.status}"
                body = json.loads(res.read().decode("utf-8"))
            vectors.extend(item["embedding"] for item in body.get("data", []))
        return (vectors, "ok") if len(vectors) == len(terms) else ([], "degraded:embedding-count-mismatch")
    except error.HTTPError as exc:
        return [], f"degraded:http-{exc.code}"
    except Exception as exc:
        return [], f"degraded:{type(exc).__name__}:{str(exc).splitlines()[0][:120]}"

def add_semantic_edges(graph, freq):
    terms = sorted(graph.nodes, key=lambda n: (graph.degree(n), freq[n], n), reverse=True)[:min(TOP_EMBED_CONCEPTS, graph.number_of_nodes())]
    if len(terms) < 2:
        return 0, "degraded:not-enough-concepts"
    vectors, status = jina_embeddings(terms)
    if status != "ok":
        warn(f"Jina embeddings unavailable ({status}); degrading to co-occurrence-only mode")
        return 0, status
    matrix = np.asarray(vectors, dtype=float)
    matrix = matrix / np.maximum(np.linalg.norm(matrix, axis=1, keepdims=True), 1e-12)
    sims, added = matrix @ matrix.T, 0
    for i, j in combinations(range(len(terms)), 2):
        if sims[i, j] > SEMANTIC_THRESHOLD and not graph.has_edge(terms[i], terms[j]):
            graph.add_edge(terms[i], terms[j], weight=float(sims[i, j]), edge_type="semantic", semantic_similarity=float(sims[i, j]))
            added += 1
    return added, "ok"

def detect_communities(graph):
    """Stage 4: Louvain if python-louvain exists; otherwise NetworkX greedy modularity."""
    if graph.number_of_nodes() == 0:
        return [], 0.0
    if graph.number_of_edges() == 0:
        return [{node} for node in graph.nodes], 0.0
    try:
        import community as community_louvain  # type: ignore
        partition, grouped = community_louvain.best_partition(graph, weight="weight", random_state=42), defaultdict(set)
        for node, cid in partition.items():
            grouped[int(cid)].add(node)
        communities = list(grouped.values())
    except Exception:
        communities = [set(c) for c in nx.algorithms.community.greedy_modularity_communities(graph, weight="weight")]
    communities.sort(key=lambda c: (-len(c), sorted(c)[0]))
    return communities, float(modularity(graph, communities, weight="weight")) if len(communities) > 1 else 0.0

def top_terms(nodes, graph, freq, limit=8): return sorted(nodes, key=lambda n: (freq[n], graph.degree(n), n), reverse=True)[:limit]
def representative(nodes, centrality, freq): return max(nodes, key=lambda n: (centrality.get(n, 0.0), freq[n], n))

def rank_gaps(communities, graph, freq, centrality):
    """Stage 6: big cluster pairs with few cross-links are structural blind spots."""
    gaps = []
    for (id_a, a), (id_b, b) in combinations(list(enumerate(communities[:TOP_COMMUNITIES])), 2):
        a, b = set(a), set(b)
        inter = sum(1 for left, right in graph.edges if (left in a and right in b) or (left in b and right in a))
        rep_a, rep_b = (top_terms(a, graph, freq, 1) or ["?"])[0], (top_terms(b, graph, freq, 1) or ["?"])[0]  # dominant in-cluster term reads more concretely than the max-betweenness bridge
        gaps.append({"clusterA_id": id_a, "clusterA_terms": top_terms(a, graph, freq), "clusterB_id": id_b, "clusterB_terms": top_terms(b, graph, freq), "inter_edges": inter, "gap_score": round((len(a) * len(b)) / (1 + inter), 4), "question": f"How does {rep_a} connect to {rep_b}?"})
    return sorted(gaps, key=lambda g: g["gap_score"], reverse=True)[:TOP_GAPS]

def write_report(result, docs, roots):
    if not REPORT_DIR.exists():
        warn(f"report directory missing, skipped markdown report: {REPORT_DIR}")
        return None
    path, m = REPORT_DIR / f"gap-miner-{date.today().isoformat()}.md", result["metrics"]
    lines = ["# Gap Miner Report", "", f"Date: {date.today().isoformat()}", f"Corpus files read: {len(docs)}", f"Corpus roots: {', '.join(str(p) for p in roots)}", f"Concepts: {m['n_concepts']}", f"Communities: {m['n_communities']}", f"Modularity: {m['modularity']}", f"Jina status: {m['jina_status']}", f"Semantic edges added: {m['semantic_edges_added']}", "", "## Communities"]
    lines += [f"- C{c['id']} ({c['size']} terms): {', '.join(c['top_terms'])}" for c in result["communities"]]
    lines += ["", "## Bridge Concepts"] + [f"- {b['term']}: {b['score']}" for b in result["bridges"]] + ["", "## Structural Gaps"]
    for gap in result["gaps"]:
        lines += [f"### C{gap['clusterA_id']} x C{gap['clusterB_id']} - score {gap['gap_score']}", f"- A: {', '.join(gap['clusterA_terms'])}", f"- B: {', '.join(gap['clusterB_terms'])}", f"- Inter-community edges: {gap['inter_edges']}", f"- Research question: {gap['question']}", ""]
    try:
        path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
        return path
    except OSError as exc:
        warn(f"could not write markdown report to {path}: {exc}")
        return None

def main(argv):
    roots = [Path(arg).expanduser() for arg in argv] if argv else DEFAULT_CORPUS_DIRS
    docs = read_corpus(roots)
    freq, provenance, by_doc = extract_concepts(docs)
    graph = build_graph({term for term, _ in freq.most_common(TOP_CONCEPTS)}, freq, provenance, by_doc)
    semantic_edges, jina_status = add_semantic_edges(graph, freq)
    communities, mod_score = detect_communities(graph)
    centrality = nx.betweenness_centrality(graph, weight=None) if graph.number_of_nodes() else {}
    result = {
        "metrics": {"n_concepts": graph.number_of_nodes(), "n_communities": len(communities), "modularity": round(mod_score, 6), "semantic_edges_added": semantic_edges, "jina_status": jina_status},
        "communities": [{"id": i, "size": len(c), "top_terms": top_terms(c, graph, freq)} for i, c in enumerate(communities)],
        "bridges": [{"term": term, "score": round(float(score), 6)} for term, score in sorted(centrality.items(), key=lambda item: item[1], reverse=True)[:TOP_BRIDGES]],
        "gaps": rank_gaps(communities, graph, freq, centrality),
    }
    write_report(result, docs, roots)
    print(json.dumps(result, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
