<p align="center"><img src="https://raw.githubusercontent.com/lucas-labs/lui-micro/HEAD/logo.svg" height="80"></p>

<p align="center">
<strong>
🎨 <code>lucas-labs/lui-micro</code> > A lightweight scss library for building themed UIs 🤏.
</strong>
</p>

<br/>
<br/>

## 📄 Documentation

### 📦 Install

Download with NPM/PNPM/YARN:

* `pnpm i @lucas-labs/lui-micro`  
* `npm i @lucas-labs/lui-micro`  
* `yarn add @lucas-labs/lui-micro`  

Then import it in your `.scss` file:

```scss
@use '~@lucas-labs/lui-micro' as lui;
@include lui.init();
```

### ⚙️ Options
The `lui.init` mixin can receive several params:

* `$theme`: default theme configuration map
* `$breakpoints `: media-breakpoints for breakpoint utilities.
* `$options`: map with options for the library. It can have the following keys:
  * `reboot`: boolean. If `true`, the reboot will be applied. Default: `true`.
  * `basic`: boolean. If `true`, the basic styles will be applied. Default: `true`.
  * `theme`: boolean. If `true`, the theme will be applied. Default: `true`.
  * `merge-theme-with-prebuilt`: boolean. If `true`, the theme will be merged with the default theme. If you choose not to merge it, you will need to provide all the necesary variables. Default: `true`.
  * `color-utilities`: boolean. If `true`, color utilities will be created. Default: `false`.
  * `typography-utilities`: boolean. If `true`, typography utilities will be created. Default: `false`.
  * `fg-var-name`: string. Indicates the name of the variable that will be used in the theme config to set the foreground color. Default: `text`
  * `bg-var-name`: string. Indicates the name of the variable that will be used in the theme config to set the background color. Default: `background`

> 💡 All parameters are optional! (defaults will be used)

### 🎨 Theme / Customization 

You can create any number of themes, but one of them needs to be the default theme. Normally, the default theame is created when calling `lui.init`.

#### Breakpoints
To set the breakpoints, you need to pass a map to the $breakpoints parameter in the `lui.init` mixin:

```scss
@use '~@lucas-labs/lui-micro' as lui;
@include lui.init(
    // this is also the default breakpoint map, 
    // so if you don't pass anything, this will be used
    $breakpoints: (
        xs: 0px,
        sm: 576px,
        md: 768px,
        lg: 992px,
        xl: 1200px,
    )
);
```

#### Setting default theme
You can set a default theme by passing a map object as a parameter to the `lui.init` mixin or by using the theme creation utility.

- Using `init` mixin example:

```scss
@use '~@lucas-labs/lui-micro' as lui;
@include lui.init(
    $theme: (
        colors: (
            ...
        ),
        variables: (
            ...
        ),
        typography: (
            ...
        ),
    )
);
```

> 💡 You can see an example of a more complete theme config [here](./demo/style.scss).

- Using theme-creation utility:

```scss
@use '~@lucas-labs/lui-micro' as lui;
@use '~@lucas-labs/lui-micro/theme' as theme;

@include lui.init();
@include theme.create-theme(
    $theme: (
        ...
        colors: (
            background: ...,
            text: ...,
            primary: ...,

            // nested maps are allowed (also allowed for variables)
            grouped: (
                a-nested-color: #fff,
                even-more-nested: (
                    ...
                ),
            )
            ...
        ),
        ...
    )
    $as-default: true // set as-default as true, so lui defaults to this theme
                      // this theme will be also used as a base for when you 
                      // create a new theme
);
```

#### Setting default theme
By using the create-theme utility you can also create themes as non-default themes. This means you'll be able to change between themes at runtime. This is possible because themes are made only of css variables.

```scss
@use '~@lucas-labs/lui-micro' as lui;
@use '~@lucas-labs/lui-micro/core' as core;

// setting a deault theme called "light"
@include lui.init(
    $theme: (
        name: "light",
        ...
    )
);

// creating another theme called "dark" that will not be default
@include core.create-theme(
    $theme: (
        name: "dark"
        ...
    )
    // don't pass $as-default here, or pass it as "false"
);
```

Now to change themes at runtime, you'll need to set an argument in your <html> tag:

```html
<html theme="dark"> 
...
</html>
```

To change it back to de default, either you set the `theme` attribute to its name, or remove the theme attribute from the html tag (it will default to the default theme):

```html
<html theme="light"> 
...
</html>
```


### Mixins

#### Vars and colors
The library includes some mixins that can be used to access the theme variables and colors

```scss
@use '@lucas-labs/lui-micro/color';
@use '@lucas-labs/lui-micro/var';

.my-div {
    background-color: color.get('primary'); // background-color: var(--c-primary);
    color: color.get('primary', 'rgb'); // color: var(--c-primary-rgb);

    // it works with nested colors too
    // provided you defined your nested theme-color as 
    // colors: (
    //     my: (
    //         nested: (
    //             color: #000,
    //         )    
    //     )
    // )
    border-color: color.get('my/nested/color'); // border-color: var(--c-my_nested_color);
    // dots instead of slashes can be used too
    border-color: color.get('my.nested.color'); // border-color: var(--c-my_nested_color);



    // get a theme variable
    border-radius: var.get('font-family'); // border-radius: var(--v-font-family);
    
    // as with colors, it works with nested variables too
    // provided you defined your nested variable as
    // variables: (
    //     my: (
    //         nested: (
    //             variable: 10px,
    //         )
    //     )
    // )
    border-radius: var.get('my/nested/variable'); // border-radius: var(--v-my_nested_variable);
}
```

#### Breakpoints

The library includes several mixins to help you create responsive layouts and styles.

```scss
@use '@lucas-labs/lui-micro/bp';

// @use '@lucas-labs/lui-micro/bp' with (
//     $breakpoints: ( sm: 576px, ... )
// );

.my-div {
    // create a breakpoint
    @include bp.up('sm') {
        // styles for sm and up
    }

    @include bp.down('sm') {
        // styles for sm and down
    }

    @include bp.only('sm') {
        // styles for sm only
    }

    @include bp.between('sm', 'md') {
        // styles for sm and md
    }

    @include bp.not('sm') {
        // styles for everything but sm
    }

}
```
#### Typographies

The library includes a mixin to get typography styles from the theme.

```scss
@use '@lucas-labs/lui-micro/typo';

.my-div {
    @include typo.typography('heading/h7');
}
```
