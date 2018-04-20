# tailwindcss-alpha

> Automatic alpha variants for your Tailwind CSS colors

## Why?

If you’re like me your Tailwind CSS color configuration often ends up looking something like this:

```js
module.exports = {
  // ...
  backgroundColors: {
    red: '#f00',
    'red-10': 'rgba(255, 0, 0, 0.1)',
    'red-20': 'rgba(255, 0, 0, 0.2)',
    'red-50': 'rgba(255, 0, 0, 0.5)',
    'red-80': 'rgba(255, 0, 0, 0.8)'
    // ...
  }
  // ...
}
```

`tailwindcss-alpha` automatically generates alpha variations for each of your background, text, and border colors.

## Install

```
npm install --save-dev tailwindcss-alpha
```

```js
// tailwind.js
module.exports = {
  // ...
  plugins: [
    require('tailwindcss-alpha')({
      modules: {
        backgroundColors: true
      },
      alpha: {
        '10': 0.1,
        '30': 0.3
      }
    })
  ]
  // ...
}
```

## Options

### `modules` (optional)

**Default:** `{ backgroundColors: true, textColors: false, borderColors: false }`

Here is where you define which Tailwind modules you would like to generate alpha variants for, and which state variants (responsive, hover, etc.) to generate for each. This option behaves in the same way as the [`modules` property in the main Tailwind configuration](https://tailwindcss.com/docs/configuration#modules), with one difference: a value of `true` means "inherit from the main Tailwind `modules` configuration."

### `alpha` (optional)

This is an object containing the alpha values for your new color utilities. If this is not specified in the plugin options the `alpha` property in your main Tailwind configuration will be used. If there is no `alpha` property then the `opacity` property is used.

The keys of this object appear at the end of the utility class names. For example if you have a background color with a key of `red` and an alpha with a key of `25` then a `bg-red-25` class would be generated.

## Example

```js
module.exports = {
  // ...
  backgroundColors: {
    red: '#f00'
  },
  // ...
  plugins: [
    require('tailwindcss-alpha')({
      modules: {
        backgroundColors: []
      },
      alpha: {
        '25': 0.25,
        '50': 0.5,
        '75': 0.75
      }
    })
  ]
  // ...
}
```

The configuration above yields the following utilities:

```css
.bg-red-25 {
  background-color: rgba(255, 0, 0, 0.25);
}

.bg-red-50 {
  background-color: rgba(255, 0, 0, 0.5);
}

.bg-red-75 {
  background-color: rgba(255, 0, 0, 0.75);
}
```
