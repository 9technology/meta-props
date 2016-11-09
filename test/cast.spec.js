import test from 'ava';
import cast from '../src/cast';

test('returns given value', (t) => {
    const val = 'foo';
    t.truthy(cast(val) === val);
});

test('returns given value as string', (t) => {
    const val = 1;
    t.is(cast(val, 'string'), '1');
});

test('returns given value as number', (t) => {
    const val = '1';
    t.is(cast(val, 'number'), 1);
});

test('parses given value as json', (t) => {
    const val = '"foo"';
    t.is(cast(val, 'json'), 'foo');
});

test('returns undefined on invalid json type', (t) => {
    const val = 'i will fail';
    t.is(cast(val, 'json'), undefined);
});

test('returns undefined as falsy boolean', (t) => {
    t.falsy(cast(undefined, 'boolean'));
});

test('returns null as falsy boolean', (t) => {
    t.falsy(cast(null, 'boolean'));
});

test('returns `false` as falsy boolean', (t) => {
    t.falsy(cast('false', 'boolean'));
});

test('returns `0` as falsy boolean', (t) => {
    t.falsy(cast('0', 'boolean'));
});

test('returns `` as falsy boolean', (t) => {
    t.falsy(cast('', 'boolean'));
});

test('returns given value as falsy boolean', (t) => {
    t.truthy(cast('true', 'boolean'));
});
