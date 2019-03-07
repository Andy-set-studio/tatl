class BaseComponent extends HTMLElement {
  constructor(props) {
    super();

    // It's handy to access what was passed through originally, so we'll store in private props
    this._props = props.props || {};
    this._state = props.state || {};
    this._get = props.get || {};
    this._set = props.set || {};

    // Run passed computed props through the computed processor
    this.get = this._processGetters();

    // Run passed props through the props processor
    this.props = this._processProps();

    // Take whatever's passed and set it as a proxy in local state
    this.state = this._monitor(this._state);

    // Determine what our root is. It can be a pointer for `this` or a shadow root
    this.root = this._processRoot();

    // Pull out a render method if there is one defined
    this.render = props.render || null;

    // Find lifecycle handlers
    this.ready = props.ready || null;
    this.removed = props.removed || null;
  }

  /**
   * LIFECYCLE METHODS
   */

  /**
   * Component is ready so run initial render and fire the `ready` function
   * if it is available
   *
   * @returns {null}
   */
  connectedCallback() {
    this._processRender();

    if (typeof this.ready === 'function') {
      this.ready();
    }
  }

  /**
   * Look for a `removed` function if the component is disconnected
   *
   * @returns {null}
   */
  disconnectedCallback() {
    if (typeof this.removed === 'function') {
      this.removed();
    }
  }

  /**
   * If an attribute is changed, re-process props and
   * re-render the component
   *
   * @returns {null}
   */
  attributeChangedCallback() {
    this.props = this._processProps();
    this._processRender();
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Create a proxy version of a passed object so that
   * changes are monitored and reactive DOM changes are made
   *
   * @returns {Object}
   */
  _monitor(objectInstance) {
    const self = this;

    return new Proxy(objectInstance, {
      set(obj, property, value) {
        // We don't want to do anything if there's no actual changes to make
        if (obj[property] === value) return;

        // If there's a setter, pass the new and old values into it and capture the value it returns
        if (self._set.hasOwnProperty(property)) {
          obj[property] = self._set[property](value, self.state[property]);
        } else {
          // Allow the value to be set with no dramas
          obj[property] = value;
        }

        // Run the render processor now that there's changes
        self._processRender();

        return true;
      }
    });
  }

  /**
   * A Triggered method that determines where to render the
   * HTML that's defined in the public `render` method
   *
   * @returns {null}
   */
  _processRender() {
    // Check if there's a render method and get the result of it if it does exist
    let renderedHTML = this.render ? this.render() : '';

    // Nothing to render so bail out
    if (!renderedHTML.length) return;

    // For this MVP, were going to _just_ set the innerHTML
    this.root.innerHTML = this.render();
  }

  /**
   * Get a data object of prop definitions and attempt to find
   * the relevant prop as an attribute on this component instance.
   * We then cast the data to the right type.
   *
   * @returns {Object}
   */
  _processProps() {
    let response = {};

    Object.keys(this._props).forEach(key => {
      let instanceResponse = {};
      let instance = this._props[key];
      let attributeValue = this._getAttribute(key);

      if (instance.default) {
        instanceResponse[key] = instance.default;
      }

      // If there's a required attribute with no value we need to do generate the most useful feedback
      if (instance.required && !attributeValue) {
        // If there's a default value, this is less severe, so set a warning and return out
        if (instance.default) {
          console.warn(`Required attribute '${key}' has no value set, so the default has been set`);
        }

        // If there's no default, this is an error. We'll set the data to be null too
        instanceResponse[key] = null;
        console.error(`Required attribute '${key}' has no value set`);
      } else {
        // We're all good here, so let's process the data
        // Make sure the data matches the declared type
        switch (instance.type) {
          case String:
          default:
            instanceResponse[key] = attributeValue;
            break;
          case Number:
            instanceResponse[key] = parseInt(attributeValue, 10);
            break;
          case Boolean:
            instanceResponse[key] = attributeValue === 'true';
            break;
          case Object:
            try {
              instanceResponse[key] = JSON.parse(attributeValue);
            } catch (ex) {
              instanceResponse[key] = {};
              console.error(`Tatl prop parse issue. Type = Object. Error = "${ex}"`);
            }
            break;
        }
      }

      // Set this data in the main response object
      response[key] = instanceResponse[key];
    });

    return response;
  }

  /**
   * Run through the defined `_get` items and convert the
   * functions into getters so they can be accessed be accessed like ${ this.get.getterName }
   *
   * @returns {Object}
   */
  _processGetters() {
    const self = this;
    let response = {};
    let keys = Object.keys(self._get);

    // Bail out if there's not any getters
    if (!keys.length) return response;

    // Run through and create a real getter
    keys.forEach(key => {
      Object.defineProperty(response, key, {
        get() {
          return self._get[key].bind(self)();
        }
      });
    });

    return response;
  }

  /**
   * Based on a passed key, attach a shadow DOM or
   * create a pointer for `this`.
   *
   * @param {String} key
   * @returns {null}
   */
  _processRoot(key) {
    switch (key) {
      case 'standard':
      default:
        return this;
      case 'shadow':
        return this.attachShadow({mode: 'open'});
      case 'shadow:closed':
        return this.attachShadow({mode: 'closed'});
    }
  }

  /**
   * A safe try/catch wrapped attribute getter
   *
   * @param {String} key
   * @returns {String}
   */
  _getAttribute(key) {
    // Convert to key from camel case to kebab case
    key = key.replace(/([A-Z])/g, '-$1');

    try {
      return this.getAttribute(key);
    } catch (ex) {
      console.error(`Get attribute error: ${ex}`);
      return '';
    }
  }
}

/**
 * Tatl loader
 * This constructs and returns a new BaseComponent
 * and also defines the custom element, if supported
 *
 * @param {String} tagName
 * @param {Object} props
 * @returns {BaseComponent}
 */
function tatl(tagName, props) {
  
  // We can't directly run new BaseComponent, because we'll 
  // get an illegal constructor error, so we instead create
  // a local class 
  const tatlInstance = class TatlComponent extends BaseComponent {
    constructor() {
      super(props);
    }
  };

  if ('customElements' in window) {
    customElements.define(tagName, tatlInstance);
  }

  return tatlInstance;
}

/**
 * WIP: This will be our tagged template helper.
 * For now, it's pretty much rendering back what it got passed in
 *
 * @param {Array} strings
 * @param {Array} values
 * @returns {String}
 */
function html(strings, ...values) {
  let response = '';
  strings.forEach((string, i) => {
    response += string + (values[i] || '');
  });
  return response;
}

export {html, tatl};
