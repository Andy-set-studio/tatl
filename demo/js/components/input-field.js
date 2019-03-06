import Tatl, {componentLoader} from '../tatl.js';

class InputField extends Tatl {
  constructor() {
    super({
      tagName: 'input-field',
      props: {
        type: {
          type: String,
          required: true
        },
        id: {
          tyep: String,
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
        const {type, id, className} = this.props;
        const {requiredAttribute, otherAttributes} = this.get;

        return `
          <input type="${type}"
                name="${id}"
                id="${id}"
                class="${className}"
                ${requiredAttribute}
                ${otherAttributes}
          />
      `;
      }
    });
  }
}

componentLoader('input-field', InputField);
export default InputField;
