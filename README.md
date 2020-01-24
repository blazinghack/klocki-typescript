# klocki-typescript
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fklockimc%2Fklocki-typescript.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fklockimc%2Fklocki-typescript?ref=badge_shield)

Yet another voxel game client

Features:
- compiles to JavaScript
- slows down at 32 chunks render distance
- 1% of the original game features

# Running

`
npm run build
`


Copy `/dist/` to your https server (the extra *s* to get orientation on mobile)

Write your own websocket server proxying to the block game server

# Getting even more FPS

`
chrome.exe --disable-gpu-vsync --disable-frame-rate-limit
`




## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fklockimc%2Fklocki-typescript.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fklockimc%2Fklocki-typescript?ref=badge_large)