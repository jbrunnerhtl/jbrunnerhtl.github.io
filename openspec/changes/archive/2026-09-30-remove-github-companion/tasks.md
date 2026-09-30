## 1. Remove the companion

- [x] 1.1 Delete `GithubCompanion.tsx`, and remove it, the `Environment`/`Lightformer` setup and the `SCENE` palette from `CanvasContainer.tsx`. Verify in screenshots that no logo appears at the hero or while scrolling
- [x] 1.2 Inline the GitHub path into `GithubIcon.tsx`, delete `githubMark.ts`, and drop `motionStore.routeU`. Verify that the navbar/hero/card icons render and that `tsc --noEmit` passes

## 2. Checks

- [x] 2.1 Run `npm run lint` and `npm run build`, plus the behaviour checks (navbar, Tab, hash, idle 0 draws). All pass
