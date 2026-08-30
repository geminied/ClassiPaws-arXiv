export type Paper = {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  target_classname: string;
};

export async function getPapers(): Promise<Paper[]> {
  const response = await fetch("/papers.json");

  if (!response.ok) {
    throw new Error("Unable to load papers dataset");
  }

  return response.json();
}