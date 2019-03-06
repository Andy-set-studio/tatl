import {componentLoader, html, Tatl} from '../tatl.js';

class InputField extends Tatl {
  constructor() {
    super({
      tagName: 'input-field',
      props: {
        type: {
          type: String,
          required: true
        },
        identifier: {
          type: String,
          required: true
        },
        label: {
          type: String,
          required: true
        },
        className: {
          type: String,
          default: null
        },
        required: {
          type: Boolean,
          default: false
        },
        otherAttributes: {
          type: Object,
          default: {}
        }
      },
      state: {},
      get: {
        requiredAttribute() {
          return this.props.required ? ' required' : '';
        },
        otherAttributes() {
          let result = '';

          if (this.props.otherAttributes) {
            Object.keys(this.props.otherAttributes).forEach(key => {
              result += ` ${key}="${this.props.otherAttributes[key]}"`;
            });
          }

          return result;
        }
      },
      render() {
        const {label, type, identifier, className} = this.props;
        const {requiredAttribute, otherAttributes} = this.get;

        const labelElem = `<label for="${identifier}" class="c-label">${label}</label>`;

        if (type === 'multiline') {
          return html`
            ${labelElem}
            <textarea name="${identifier}" id="${identifier}" class="${className}" ${requiredAttribute} ${otherAttributes}></textarea>
          `;
        }

        return html`
          ${labelElem}
          <input type="${type}" name="${identifier}" id="${identifier}" class="${className}" ${requiredAttribute} ${otherAttributes} />
        `;
      }
    });
  }
}

componentLoader('input-field', InputField);
export default InputField;
