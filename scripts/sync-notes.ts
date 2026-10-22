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
 * - Files that already have frontmatter with title + published are kept as-is
 *   (only `category` is added if missing)
 * - Files without frontmatter get one generated:
 *     title     <- first level-1 heading, else the file name
 *     published <- date of the file's first git commit
 *     updated   <- date of the latest git commit
 *     tags      <- parent directory names (e.g. gpu -> GPU)
 *     category  <- Learning
 * - Skips the root README.md and anything whose name starts with "_" or "."
 * - Images next to notes are copied too, so relative image links keep working
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

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

function yamlString(s: string): string {
	return JSON.stringify(s);
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

		let body = await fs.readFile(src, "utf-8");
		let output: string;

		const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
		if (fm && /^title:/m.test(fm[1]) && /^published:/m.test(fm[1])) {
			let head = fm[1];
			if (!/^category:/m.test(head)) head += `\ncategory: ${CATEGORY}`;
			output = `---\n${head}\n---\n${body.slice(fm[0].length)}`;
		} else {
			if (fm) body = body.slice(fm[0].length);
			const h1 = body.match(/^#\s+(.+?)\s*#*\s*$/m);
			const title = h1 ? h1[1] : path.basename(rel, ext);
			if (h1) body = body.replace(h1[0], "").replace(/^\s*\n/, "");
			const today = new Date().toISOString().slice(0, 10);
			const published = gitDate(rel, "first") ?? today;
			const updated = gitDate(rel, "last") ?? published;
			const dirTags = path
				.dirname(rel)
				.split(path.sep)
				.filter((d) => d && d !== ".")
				.map((d) => (d.length <= 3 ? d.toUpperCase() : d));
			const lines = [
				`title: ${yamlString(title)}`,
				`published: ${published}`,
				updated !== published ? `updated: ${updated}` : "",
				`category: ${CATEGORY}`,
				`tags: [${dirTags.map(yamlString).join(", ")}]`,
			].filter(Boolean);
			output = `---\n${lines.join("\n")}\n---\n\n${body}`;
		}

		await fs.mkdir(path.dirname(dest), { recursive: true });
		await fs.writeFile(dest, output);
		count++;
	}
	console.log(`[sync-notes] ${count} notes synced from ${NOTES_REPO}`);
}

await main();
