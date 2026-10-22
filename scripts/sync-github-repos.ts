/**
 * Fetch public repos from GitHub at build time and write them to
 * src/constants/github-repos.json for the GitHub section on the Projects page.
 *
 * - User comes from GITHUB_USER (default: vInThePrism)
 * - Uses GITHUB_TOKEN when present (set automatically in GitHub Actions)
 * - On failure the existing JSON is kept, so the build never breaks
 */
import fs from "node:fs/promises";

const OUTPUT_FILE = "src/constants/github-repos.json";
const USER = process.env.GITHUB_USER || "vInThePrism";

interface RawRepo {
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	fork: boolean;
	archived: boolean;
	private: boolean;
	pushed_at: string;
	topics?: string[];
	homepage: string | null;
}

export interface GithubRepo {
	name: string;
	fullName: string;
	url: string;
	description: string;
	language: string;
	stars: number;
	forks: number;
	fork: boolean;
	pushedAt: string;
	topics: string[];
	homepage: string;
}

async function main(): Promise<void> {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"User-Agent": "vintheprism-site-builder",
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	try {
		const res = await fetch(
			`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&type=owner`,
			{ headers, signal: AbortSignal.timeout(15000) },
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const raw = (await res.json()) as RawRepo[];
		const repos: GithubRepo[] = raw
			.filter((r) => !r.private && !r.archived)
			// Hide the site repo itself
			.filter((r) => r.name.toLowerCase() !== `${USER}.github.io`.toLowerCase())
			.map((r) => ({
				name: r.name,
				fullName: r.full_name,
				url: r.html_url,
				description: r.description ?? "",
				language: r.language ?? "",
				stars: r.stargazers_count,
				forks: r.forks_count,
				fork: r.fork,
				pushedAt: r.pushed_at,
				topics: r.topics ?? [],
				homepage: r.homepage ?? "",
			}));
		await fs.writeFile(
			OUTPUT_FILE,
			`${JSON.stringify({ user: USER, updatedAt: new Date().toISOString(), repos }, null, "\t")}\n`,
		);
		console.log(`[sync-github-repos] ${repos.length} repos written`);
	} catch (err) {
		console.warn(`[sync-github-repos] fetch failed, keeping cache: ${err}`);
		try {
			await fs.access(OUTPUT_FILE);
		} catch {
			await fs.writeFile(
				OUTPUT_FILE,
				`${JSON.stringify({ user: USER, updatedAt: "", repos: [] }, null, "\t")}\n`,
			);
		}
	}
}

await main();
