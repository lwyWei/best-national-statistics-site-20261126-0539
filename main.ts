// Aldermere Statistics — entry program (Node 22, standard library only).
//
// Hands the site in: copies app/ and screenshots/ from beside this file to
// /output (or $MAKEFUN_OUTPUT_DIR outside the grader) and writes
// /output/dossier.json with buildDossier from vendor/makefun-frontend.ts,
// the kit's copy, unchanged. The scorer requires dossier.json to be byte for
// byte what its own copy of the library writes, so this program also rebuilds
// the dossier a second time and refuses to finish if the bytes differ.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice: both runs must write the same bytes.

import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy the site and its screenshots into the output directory.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: text_max_bytes shapes the dossier's bytes; the others
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 16 MiB of
// app files, counted beside /output's own 1000-entry cap).
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);

// Self-check: rebuild the dossier from the copied files and compare bytes,
// so a stale or partial copy can never be handed in silently. buildDossier
// returns a Uint8Array, so compare the bytes, never the object identities.
const rebuilt = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
if (!Buffer.from(dossier).equals(Buffer.from(rebuilt))) {
  throw new Error('dossier.json is not stable: the rebuilt dossier differs from the written one');
}

// Leave every output readable by every user: the grader collects /output as
// another user than the one this program runs as. Files get 0644, folders 0755.
function chmodTree(dir) {
  chmodSync(dir, 0o755);
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) chmodTree(p);
    else chmodSync(p, 0o644);
  }
}
chmodTree(out);
