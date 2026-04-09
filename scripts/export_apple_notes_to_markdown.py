#!/usr/bin/env python3
"""Export Apple Notes to Markdown, excluding sensitive notes."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from collections import Counter
from datetime import date
from pathlib import Path


SENSITIVE_KEYWORDS = [
    "密码",
    "password",
    "passwd",
    "passcode",
    "otp",
    "验证码",
    "2fa",
    "二步验证",
    "密钥",
    "secret",
    "secrets",
]

EXCLUDED_TITLE_PATTERNS = [
    "抖音霸王兽",
]


def sanitize_segment(value: str, fallback: str) -> str:
    cleaned = re.sub(r'[\\/:*?"<>|]+', "-", value).strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    cleaned = cleaned[:80].strip(" .")
    return cleaned or fallback


RECORD_SEP = "\u001e"
FIELD_SEP = "\u001f"


def run_osascript(script: str) -> str:
    result = subprocess.run(
        ["osascript"],
        input=script,
        text=True,
        capture_output=True,
        check=True,
    )
    return result.stdout.strip()


def list_folders() -> list[tuple[str, str, int]]:
    script = """
tell application "Notes"
  set outLines to {}
  repeat with acc in every account
    set accName to name of acc
    repeat with f in every folder of acc
      set end of outLines to accName & "|||FOLDER|||" & (name of f) & "|||COUNT|||" & (count of every note of f)
    end repeat
  end repeat
  return outLines
end tell
"""
    output = run_osascript(script)
    folders: list[tuple[str, str, int]] = []
    for item in output.split(", "):
        if "|||FOLDER|||" not in item or "|||COUNT|||" not in item:
            continue
        account, rest = item.split("|||FOLDER|||", 1)
        folder, count = rest.rsplit("|||COUNT|||", 1)
        folders.append((account, folder, int(count)))
    return folders


def should_skip_note(folder: str, title: str) -> bool:
    folder_l = folder.lower()
    title_l = title.lower()
    if any(keyword.lower() in folder_l for keyword in SENSITIVE_KEYWORDS):
        return True
    if any(keyword.lower() in title_l for keyword in SENSITIVE_KEYWORDS):
        return True
    if any(pattern in title for pattern in EXCLUDED_TITLE_PATTERNS):
        return True
    return False


def fetch_note_batch(account: str, folder: str, start_index: int, end_index: int) -> list[dict[str, str]]:
    script = f"""
tell application "Notes"
  set outText to ""
  set theFolder to folder "{folder.replace('"', '\\"')}" of account "{account.replace('"', '\\"')}"
  repeat with idx from {start_index} to {end_index}
    set theNote to note idx of theFolder
    set outText to outText & (name of theNote) & "{FIELD_SEP}" & (plaintext of theNote) & "{RECORD_SEP}"
  end repeat
  return outText
end tell
"""
    output = run_osascript(script)
    if not output:
        return []

    notes: list[dict[str, str]] = []
    for record in output.split(RECORD_SEP):
        if FIELD_SEP not in record:
            continue
        title, body = record.split(FIELD_SEP, 1)
        if should_skip_note(folder, title):
            continue
        notes.append(
            {
                "account": account,
                "folder": folder,
                "title": title,
                "body": body,
            }
        )
    return notes


def write_markdown(notes: list[dict[str, str]], output_dir: Path, counts: Counter[str], start_index: int) -> int:
    written = 0
    for offset, note in enumerate(notes, start=0):
        index = start_index + offset
        account = sanitize_segment(note["account"], "Unknown Account")
        folder = sanitize_segment(note["folder"], "Notes")
        title = note["title"].strip() or f"Untitled {index}"
        filename = sanitize_segment(title, f"note-{index:04d}") + ".md"

        target_dir = output_dir / account / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / filename

        suffix = 2
        while target_path.exists():
            target_path = target_dir / f"{Path(filename).stem}-{suffix}.md"
            suffix += 1

        body = note["body"].rstrip() + "\n"
        content = (
            f"---\n"
            f'title: "{title.replace(chr(34), chr(39))}"\n'
            f'account: "{note["account"].replace(chr(34), chr(39))}"\n'
            f'folder: "{note["folder"].replace(chr(34), chr(39))}"\n'
            f"---\n\n"
            f"{body}"
        )
        target_path.write_text(content, encoding="utf-8")
        counts[f'{note["account"]} / {note["folder"]}'] += 1
        written += 1

    return written


def write_summary(output_dir: Path, total: int, counts: Counter[str]) -> None:
    lines = [
        "# Apple Notes Export",
        "",
        f"- Export date: {date.today().isoformat()}",
        f"- Notes exported: {total}",
        f"- Excluded: folders/titles containing password-related keywords, plus titles containing `抖音霸王兽`",
        "",
        "## Folder Counts",
        "",
    ]
    for name, count in sorted(counts.items()):
        lines.append(f"- {name}: {count}")
    lines.append("")
    (output_dir / "README.md").write_text("\n".join(lines), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export Apple Notes to Markdown.")
    parser.add_argument(
        "--output-dir",
        default=f"exports/apple-notes-markdown-{date.today().isoformat()}",
        help="Directory where markdown notes will be written.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    folders = sorted(list_folders(), key=lambda item: item[2])
    counts: Counter[str] = Counter()
    total = 0
    batch_size = 50

    for account, folder, count in folders:
        if any(keyword.lower() in folder.lower() for keyword in SENSITIVE_KEYWORDS):
            continue
        print(f"Exporting {account} / {folder} ({count})...", file=sys.stderr, flush=True)
        for start_index in range(1, count + 1, batch_size):
            end_index = min(start_index + batch_size - 1, count)
            notes = fetch_note_batch(account, folder, start_index, end_index)
            total += write_markdown(notes, output_dir, counts, total + 1)

    write_summary(output_dir, total, counts)
    print(f"Exported {total} notes to {output_dir}")


if __name__ == "__main__":
    main()
