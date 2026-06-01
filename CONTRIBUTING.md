# Contributing & Git workflow

EitaaSharp uses a lightweight **GitHub Flow**: `main` is always green and releasable,
and every change lands through a short-lived branch.

## Branches

- **`main`** — always builds and passes all tests. Never commit to it directly.
- **Work branches** — branched from the latest `main`, one focused change each, deleted after merge:

  | Prefix       | Use for                                |
  |--------------|----------------------------------------|
  | `feat/`      | a new feature                          |
  | `fix/`       | a bug fix                              |
  | `refactor/`  | restructuring with no behavior change  |
  | `perf/`      | performance work                       |
  | `docs/`      | documentation only                     |
  | `test/`      | tests only                             |
  | `chore/`     | tooling, deps, build, config           |

  Use kebab-case, descriptive names — e.g. `feat/high-level-messages`, `fix/long-byte-order`.

## Workflow

```bash
git switch main && git pull              # start from the latest main
git switch -c feat/<slug>                # branch off

# ...work, committing as you go...
dotnet build EitaaSharp.slnx
dotnet test  EitaaSharp.slnx             # must be green before merging

git push -u origin feat/<slug>           # push the branch
# Open a PR on GitHub and merge it, OR merge locally:
git switch main && git merge --no-ff feat/<slug> && git push
git branch -d feat/<slug>                # clean up
```

`--no-ff` keeps each change as a visible merge group on `main`.

## Commits — Conventional Commits

`type(scope): summary`, imperative mood. Examples:

- `feat(client): add Message.ReplyAsync bound method`
- `fix(tl): correct bytes padding boundary`
- `docs(readme): document the login flow`

Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`.

## Releases — SemVer

Tag releases on `main` as `vMAJOR.MINOR.PATCH`. Before `1.0.0` the public API may
change between minor versions.

```bash
git switch main && git pull
git tag -a v0.1.0 -m "EitaaSharp 0.1.0"
git push origin v0.1.0
```

## Rules of thumb

- One logical change per branch / PR.
- `main` must stay green — build + all tests pass before every merge.
- Keep your branch current with `git merge main` (or rebase) if `main` moved.
- Never commit secrets (tokens, `*.session.json` are git-ignored).
