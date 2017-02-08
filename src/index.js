import camelcase from 'camelcase';
import cast from './cast';

export default (query = null, splitter = ':') => {
    const selector = (query) ? `meta[name^="${query}"]` : 'meta';
    const meta = document.head.querySelectorAll(selector);
    let props = {};

    metaTag: for (let i = 0, len = meta.length; i < len; i++) {
        let base = props;

        const tag = meta.item(i);
        const name = tag.getAttribute('name');

        // check for meta tag name
        if (name === null) {
            continue;
        }

        const type = tag.getAttribute('type');
        const key = (query) ? name.substring(query.length) : name;
        const value = cast(tag.getAttribute('content'), type);
        const split = key.split(splitter).filter(Boolean).map(k => camelcase(k));
        const splitLen = split.length;

        // singular value
        if (!splitLen) {
            // single array value
            if (len > 1) {
                if (!Array.isArray(props)) props = [];
                props.push(value);
            } else {
                props = value;
                break;
            }
        }

        const lastIndex = splitLen - 1;
        for (let j = 0; j < splitLen; j++) {
            const path = split[j];

            // last split, assign
            if (j === lastIndex) {
                let val = base[path];
                // set
                if (typeof val === 'undefined') {
                    base[path] = value;
                } else { // already set, convert multiples to array
                    if (!Array.isArray(val)) {
                        val = base[path] = [val];
                    }
                    val.push(value); // we looped from the end
                }
                continue;
            }

            // set next path
            base[path] = base[path] || {};
            base = base[path];

            if (typeof base !== 'object') {
                console.warn(`Meta Props: Skipping \`${name}\`, type mismatch, key exists as a (${typeof base}).`);
                continue metaTag;
            }
        }
    }

    return props;
};
