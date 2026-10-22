/**
 * 构建时从 GitHub 拉取公开仓库列表，写入 src/constants/github-repos.json，
 * 供「项目」页底部的 GitHub 仓库区块使用。
 *
 * - 用户名来自 GITHUB_USER 环境变量，默认 vInThePrism
 * - 在 GitHub Actions 里会自动带上 GITHUB_TOKEN，避免匿名限流
 * - 拉取失败时保留已有的 JSON，不会让构建失败
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
			// 不展示网站仓库自身
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
