<!--
/**
 * @author dondevi
 * @create 2016-09-08
 * @update 2017-05-24
 */
-->

# XFH5
> **X**ing**F**u Network **H**TML**5** Framework

## Documentation
> <https://dondevi.github.io/wechat-h5-framework/docs/index.html>


## Development
> Run Local Server: http://localhost:8000

```shell
  npm run dev
```


## Production
> Build `/src` to `/dist`

```
  npm run dist
```


## Architecture

* `dist`: source code will be compiled to this distination folder
* `docs`: markdown documents for this framework
* `src`:  source code
* `tests`: karma test files
* `vendors`: third party libraies

```
  ┌──────────────────┐
  │    components    │
  ├─────────┬────────┤
  │ modules │ themes │
  └─────────┴────────┘
  ┌──────────────────┐
  │      vendors     │
  └──────────────────┘
```

## Todo list

* Rebuild
* Themes
* Vue


## Document build

### When Source change:
1. Build `$ npm run dist`
2. Pack `dist` to `docs/xfh5-x.x.x.rar`
3. Move `dist` to `docs/xfh5`
4. Change version text in `docs/markdown/main.md`

### When Markdown change:
1. Sublime Build `docs/markdown/index.md` - `Ctrl + B`
2. Open `docs/markdown/index.html`
3. Replace css & script's absolute path `../../docs/` to `./`
4. Move `docs/markdown/index.html` to `docs/index.html`
