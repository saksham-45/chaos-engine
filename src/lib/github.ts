import { GitHubRepo, RepoLanguages, ProcessedProject } from '@/types/github';

export const GITHUB_USERNAME = 'saksham-45';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch all public repositories for a user
 */
export async function fetchUserRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    return repos.filter(repo => !repo.archived && !repo.disabled);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

/**
 * Fetch languages for a specific repository
 */
export async function fetchRepoLanguages(languagesUrl: string): Promise<RepoLanguages> {
  try {
    const response = await fetch(languagesUrl, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    return {};
  }
}

/**
 * Check if repository has meaningful content (at least 2-3 files)
 * We use size as a proxy - repos with size > 1KB likely have multiple files
 */
function hasMeaningfulContent(repo: GitHubRepo): boolean {
  // Filter out empty repos or repos with just a README
  // Size is in KB, so > 1KB suggests multiple files
  return repo.size > 1;
}

/**
 * Process and enrich repository data
 */
export async function processRepos(repos: GitHubRepo[]): Promise<ProcessedProject[]> {
  const meaningfulRepos = repos.filter(hasMeaningfulContent);
  
  const processed: ProcessedProject[] = await Promise.all(
    meaningfulRepos.map(async (repo) => {
      const languages = await fetchRepoLanguages(repo.languages_url);
      const primaryLanguage = repo.language || Object.keys(languages)[0] || null;

      return {
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        homepage: repo.homepage,
        language: primaryLanguage,
        languages,
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        createdAt: repo.created_at,
        slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        hasContent: true,
      };
    })
  );

  // Sort by updated date (most recent first)
  return processed.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Get all processed projects
 */
export async function getAllProjects(): Promise<ProcessedProject[]> {
  const repos = await fetchUserRepos();
  return processRepos(repos);
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ProcessedProject | null> {
  const projects = await getAllProjects();
  return projects.find(p => p.slug === slug) || null;
}

