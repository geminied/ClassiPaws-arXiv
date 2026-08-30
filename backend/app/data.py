import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "data" / "papers.json"


with open(
    DATA_PATH,
    "r",
    encoding="utf-8"
) as f:

    PAPERS = json.load(f)


def get_classes():

    classes = sorted(
        {
            paper.get(
                "target_classname",
                ""
            )
            for paper in PAPERS
            if paper.get("target_classname")
        }
    )

    return classes


def get_paper(
    paper_id: str
):

    for paper in PAPERS:

        if paper.get("id") == paper_id:
            return paper

    return None


def search_papers(
    query: str = "",
    target_class: str = "",
    limit: int = 20
):

    query = query.lower().strip()
    target_class = target_class.lower().strip()

    results = []

    for paper in PAPERS:

        paper_class = str(
            paper.get(
                "target_classname",
                ""
            )
        ).lower()

        if target_class:

            if paper_class != target_class:
                continue

        if query:

            searchable = " ".join(
                [
                    str(paper.get("title", "")),
                    str(paper.get("abstract", "")),
                    str(paper.get("authors", ""))
                ]
            ).lower()

            if query not in searchable:
                continue

        results.append(paper)

        if len(results) >= limit:
            break

    return results