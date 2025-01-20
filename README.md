<h1 align="center">
	<code>lucaslabs</code> › <a href="https://gitea.io">Gitea</a> theme
</h1>

*Theme for `lucaslabs` internal gitea server.*

## `dark`

![dark theme](figs/dark.png)

## `light`

![light theme](figs/light.png)

## `auto`

Switches between `dark` and `light` automatically based on the user's system preference.

## Usage

1. Go to the [releases page](https://github.com/lucas-labs/gitea-lugit-theme/releases) and get the latest `gitea-lugit-theme.tar.gz` release file.
2. Place the `templates` and `public` folder in your `$GITEA_CUSTOM` directory.
3. Append the themes in your `app.ini` file:

```ini
[ui]
THEMES=...,dark,light,auto
DEFAULT_THEME=dark # optional
```

> 💡 You can change the names of the themes by changing the name of the theme files in `public/css/theme-{name}.css` and in the `app.ini` file, accordingly.

4. Restart `gitea`.

> [!NOTE]
> The latest version works with `gitea` version `v1.22.x`.

## Credits

- [`catppuccin/gitea`](https://github.com/catppuccin/gitea), these themes are based on them.

## Development

### build
```bash
$ npm install
$ npm run build
```

### serve
```bash
$ npm run serve -- --server path/to/gitea/custom

# e.g.

# on linux
$ npm run serve -- --server ~/gitea/custom
# on windows
$ npm run serve -- -- --server c:/gitea/custom
```


# Changes in templates

## `home.tmpl`

Here we remove everything (default gitea welcome page). We only keep the logo and the header with the login button.

## `base/head_navbar.tmpl`

The only change here is to make the logo smaller.

```diff
- <img height="30" width="30" src="{{AssetUrlPrefix}}/img/logo.svg" alt="{{ctx.Locale.Tr "logo"}}" aria-hidden="true">
+ <img height="24" src="{{AssetUrlPrefix}}/img/logo.svg" alt="{{ctx.Locale.Tr "logo"}}" aria-hidden="true">
```

## `repo/home.tmpl`

+ adds `<div class="lugit-repo-header-data">...</div>` as a wrapper for the repo header data (description + labels)
+ adds `<div class="lugit-repo-content">` as a wrapper for the repo content (files, commits, branches, etc.)

Later we use css to go from default 1 column layout to 2 column layout more similar to github's design.

```diff
- <div class="ui container {{if .IsBlame}}fluid padded{{end}}>
+ <div class="ui container {{if .IsBlame}}fluid padded{{end}} {{if and (not .IIsViewFile) (not .IsBlame)}}lugit-repo-list-view{{end}}">
```

Adds the class `lugit-repo-list-view` to the container of the repo content (only when we are not viewing a file or in blame view). This allows us to change the layout of the main repo view, except when viewing a file or in blame view.
