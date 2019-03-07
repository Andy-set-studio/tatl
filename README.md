# Tatl ✨
A tiny base component to guide you to a consistent Web Component authoring experience

⚠️ **Tatl is a work in progress and very unstable. Feedback and contributions are very much encouraged.** ⚠️

**Demo** <https://tatl-demo.netlify.com>

## About

Tatl is a base class for Web Components that gives you a clean, consistent structure, much like a [Vue](//vuejs.org) component.

## Getting started

Install Tatl via NPM:

`npm install tatl`

Import Tatl, the HTML helper and the component loader into your component file:

**my-component.js**

```javascript
import {html, tatl} from 'tatl';
```

Then you can author your component like so: 

**my-component.js**

```javascript
const myComponent = tatl('my-component', {
  props: {
    personName: {
      type: String,
      required: true
    }
  },
  state: {
    greeting: 'Hello'
  },
  render() {
    const {greeting} = this.state;
    const {personName} = this.props;
    
    return html`
      <p>
         ${greeting}, there! My name is ${personName}
      </p>
    `;
  }
});

export default myComponent;
```

**index.html**

```html
<my-component person-name="Andy"></my-component>
```

## What you get out of the box

### Root definition

You can use a standard root, a closed Shadow DOM root or an open Shadow DOM root by specifying a `root` in your config object:

| Key   | Value   |
|---|---|
| `standard`  | A normal HTML root  |
| `shadow`  | An open Shadow DOM root  |
| `shadow:closed`  | A closed Shadow DOM root  |

### Props

You pass props as HTML attributes on the component and then get access to them inside your component's JavaScript with `this.props`. See [example in the demo](https://github.com/andybelldesign/tatl/blob/master/demo/js/components/input-field.js#L51).

```html
<example-component class-name="a-class" required="true"></example-component>
```

You'll need to define your prop types, too, like so: 

```javascript
props: {
  className: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  }
}
``` 

You can see this in action in the [demo component](https://github.com/andybelldesign/tatl/blob/master/demo/js/components/input-field.js#L7). 

### State

You can have reactive state by using the `state` property of your config object. Every time an element of your `state` is updated, your component will re-render.

You can access state with `this.state` in your components. 

### Getters

Getters are computed functions that are used like props in your templates.

#### Example

```
// Config object
get: {
  myGetter() {
    const name = 'Andy';
    return `Hello, I'm ${name}`;
  }
}
```

You can see a getter in action in the [demo component](https://github.com/andybelldesign/tatl/blob/master/demo/js/components/input-field.js#L34).

## Roadmap

- [ ] 📝 Write some proper docs
- [ ] 🏗 Implement a better HTML rendering setup, rather than `innerHTML = this.render()` 🙈
- [x] 🏗 Find a way of auto loading components, rather than using the `componentLoader`
- [ ] 🏗 Create more comprehensive demos
