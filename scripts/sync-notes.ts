/**
 * Sync Markdown from the notes repo (default: vInThePrism/notes) into the site's
 * "Learning" category.
 *
 * Usage: NOTES_DIR=/path/to/notes npx tsx scripts/sync-notes.ts
 * GitHub Actions checks out the notes repo first and sets NOTES_DIR.
 * If NOTES_DIR is unset or missing, the script is a no-op and the build continues.
 *
 * Rules:
 * - Each .md becomes src/content/posts/notes/<relative path>.md (gitignored)
 * - Frontmatter in the note (from the notes editor at /admin/notes/ or written by
 *   hand) always wins. Missing or empty fields are filled in:
 *     title     <- first level-1 heading, else the file name
 *     published <- date of the file's first git commit
 *     updated   <- date of the latest git commit (if later than published)
 *     tags      <- parent directory names (e.g. gpu -> GPU)
 *     category  <- Learning
 * - A leading "# Heading" that repeats the title is dropped (the page shows the title)
 * - `draft: true` hides a note from the site
 * - Skips the root README.md and anything whose name starts with "_" or "."
 * - Images next to notes are copied too, so relative image links keep working
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = process.env.NOTES_DIR;
const NOTES_REPO = process.env.NOTES_REPO || "vInThePrism/notes";
const OUT_DIR = "src/content/posts/notes";
const CATEGORY = "Learning";
const ASSET_EXT = new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".avif",
	".svg",
]);

function gitDate(file: string, which: "first" | "last"): string | null {
	try {
		const out = execFileSync(
			"git",
			[
				"-C",
				NOTES_DIR as string,
				"log",
				"--follow",
				"--format=%aI",
				"--",
				file,
			],
			{ encoding: "utf-8" },
		)
			.trim()
			.split("\n")
			.filter(Boolean);
		if (out.length === 0) return null;
		return (which === "first" ? out[out.length - 1] : out[0]).slice(0, 10);
	} catch {
		return null;
	}
}

function nonEmpty(v: unknown): boolean {
	if (v === null || v === undefined) return false;
	if (typeof v === "string") return v.trim() !== "";
	if (Array.isArray(v)) return v.length > 0;
	return true;
}

function toDate(v: unknown): Date | null {
	if (!nonEmpty(v)) return null;
	if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
	const str = String(v);
	const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(str) ? `${str}T00:00:00Z` : str);
	return Number.isNaN(d.getTime()) ? null : d;
}

async function* walk(dir: string, rel = ""): AsyncGenerator<string> {
	for (const entry of await fs.readdir(path.join(dir, rel), {
		withFileTypes: true,
	})) {
		if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
		if (entry.name === "node_modules") continue;
		const r = path.join(rel, entry.name);
		if (entry.isDirectory()) yield* walk(dir, r);
		else yield r;
	}
}

async function main(): Promise<void> {
	if (!NOTES_DIR) {
		console.log("[sync-notes] NOTES_DIR not set, skipping");
		return;
	}
	try {
		await fs.access(NOTES_DIR);
	} catch {
		console.log(`[sync-notes] ${NOTES_DIR} not found, skipping`);
		return;
	}

	await fs.rm(OUT_DIR, { recursive: true, force: true });
	let count = 0;

	for await (const rel of walk(NOTES_DIR)) {
		const ext = path.extname(rel).toLowerCase();
		const src = path.join(NOTES_DIR, rel);
		const dest = path.join(OUT_DIR, rel);

		if (ASSET_EXT.has(ext)) {
			await fs.mkdir(path.dirname(dest), { recursive: true });
			await fs.copyFile(src, dest);
			continue;
		}
		if (ext !== ".md") continue;
		if (path.dirname(rel) === "." && /^readme\.md$/i.test(path.basename(rel)))
			continue;

		// Frontmatter written by the notes editor (or by hand) wins; anything missing is filled in.
		const raw = await fs.readFile(src, "utf-8");
		let parsed: { data: Record<string, unknown>; content: string };
		try {
			parsed = matter(raw);
		} catch (err) {
			console.warn(`[sync-notes] ${rel}: invalid frontmatter, treating the whole file as body (${err})`);
			parsed = { data: {}, content: raw };
		}
		const data = parsed.data as Record<string, unknown>;
		let body = parsed.content.replace(/^\s*\n/, "");

		const h1 = body.match(/^#\s+(.+?)\s*#*\s*$/m);
		const title = nonEmpty(data.title) ? String(data.title) : h1 ? h1[1] : path.basename(rel, ext);
		// Drop the first heading when it just repeats the title (the page already shows the title)
		if (h1 && h1[1].trim() === title.trim()) {
			body = body
				.replace(h1[0], "")
				.replace(/^\s*\n/, "")
				// …and a horizontal rule that was only there to separate the heading
				.replace(/^(?:-{3,}|\*{3,}|_{3,})[ \t]*\n/, "");
		}

		const firstCommit = gitDate(rel, "first");
		const lastCommit = gitDate(rel, "last");
		const published = toDate(data.published) ?? toDate(firstCommit) ?? new Date();
		const updated =
			toDate(data.updated) ??
			(lastCommit && lastCommit !== firstCommit ? toDate(lastCommit) : null);

		const dirTags = path
			.dirname(rel)
			.split(path.sep)
			.filter((d) => d && d !== ".")
			.map((d) => (d.length <= 3 ? d.toUpperCase() : d));
		const tags =
			Array.isArray(data.tags) && data.tags.filter(nonEmpty).length > 0
				? data.tags.filter(nonEmpty).map(String)
				: dirTags;

		const front: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(data)) {
			if (nonEmpty(v)) front[k] = v;
		}
		front.title = title;
		front.published = published;
		if (updated && updated.getTime() > published.getTime()) front.updated = updated;
		else delete front.updated;
		front.category = nonEmpty(data.category) ? data.category : CATEGORY;
		front.tags = tags;

		// Pass an object, not a string: a body that starts with a "---" rule must not be re-parsed as frontmatter
		const output = matter.stringify({ content: `\n${body}`, data: {} } as unknown as string, front);

		await fs.mkdir(path.dirname(dest), { recursive: true });
		await fs.writeFile(dest, output);
		count++;
	}
	console.log(`[sync-notes] ${count} notes synced from ${NOTES_REPO}`);
}

await main();
