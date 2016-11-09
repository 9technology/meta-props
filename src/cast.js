export default (value, type) => {
    switch (type) {
        case 'boolean': return [undefined, null, 'false', '0', ''].indexOf(value) === -1;
        case 'number': return parseInt(value, 10);
        case 'string': return `${value}`;
        case 'json': {
            try {
                return JSON.parse(value);
            } catch (err) {
                /* eslint-disable consistent-return */
                return;
            }
        }
        default: return value;
    }
};
