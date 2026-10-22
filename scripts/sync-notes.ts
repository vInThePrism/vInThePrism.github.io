/**
 * 把笔记仓库（默认 vInThePrism/notes）里的 Markdown 同步成网站「学习」分类下的文章。
 *
 * 用法：NOTES_DIR=/path/to/notes npx tsx scripts/sync-notes.ts
 * GitHub Actions 会先 checkout 笔记仓库，再设置 NOTES_DIR 运行本脚本。
 * 没有设置 NOTES_DIR 或目录不存在时直接跳过，不影响构建。
 *
 * 规则：
 * - 每个 .md 生成 src/content/posts/notes/<相对路径>.md（该目录已加入 .gitignore）
 * - 已有 frontmatter（含 title 和 published）的文件原样使用，只补 category
 * - 没有 frontmatter 的文件自动生成：
 *     title     ← 第一个一级标题，否则文件名
 *     published ← 该文件在 git 里首次提交的日期
 *     updated   ← 最近一次提交的日期
 *     tags      ← 所在目录名（如 gpu）
 *     category  ← 学习
 * - 文件名以 _ 开头、或位于以 _ / . 开头的目录里的文件会被跳过；根目录 README.md 也跳过
 * - 同目录下的图片等资源会一并复制，相对路径引用照常可用
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const NOTES_DIR = process.env.NOTES_DIR;
const NOTES_REPO = process.env.NOTES_REPO || "vInThePrism/notes";
const OUT_DIR = "src/content/posts/notes";
const CATEGORY = "学习";
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
