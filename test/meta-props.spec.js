import test from 'ava';
import { jsdom } from 'jsdom';
import sinon from 'sinon';
import proxy from 'proxyquire';
import camelcase from 'camelcase';

const sandbox = sinon.sandbox.create();
const castStub = sandbox.stub().returnsArg(0);
const camelSpy = sandbox.spy(camelcase);

proxy.noCallThru();
const metaProps = proxy('../src', {
    camelcase: camelSpy,
    './cast': castStub,
}).default;
proxy.callThru();

const doc = jsdom();
global.document = doc;

sandbox.spy(doc.head, 'querySelectorAll');
sandbox.stub(console, 'warn');

test.beforeEach(() => {
    sandbox.reset();
    doc.head.innerHTML = ''; // reset meta tags
});

test('no props returns empty object', (t) => {
    t.deepEqual(metaProps(), {});
});

test('query meta tags with default selector', (t) => {
    metaProps();
    t.truthy(doc.head.querySelectorAll.calledWith('meta'));
});

test('query meta tags with given selector', (t) => {
    metaProps('foo');
    t.truthy(doc.head.querySelectorAll.calledWith('meta[name^="foo"]'));
});

test('returns props with key and value set', (t) => {
    document.head.innerHTML = '<meta name="foo" content="bar">';
    const props = metaProps();
    t.is(props.foo, 'bar');
});

test('returns props with key and value set calling cast', (t) => {
    document.head.innerHTML = '<meta name="foo" content="bar" type="baz">';
    metaProps();
    t.truthy(castStub.calledWith('bar', 'baz'));
});

test('creates arrays for multiple meta tags', (t) => {
    document.head.innerHTML = `
        <meta name="foo" content="0">
        <meta name="foo" content="1">
    `;
    const props = metaProps();
    t.truthy(Array.isArray(props.foo));
});

test('creates arrays for multiple meta tags in correct order', (t) => {
    document.head.innerHTML = `
        <meta name="foo" content="0">
        <meta name="foo" content="1">
        <meta name="foo" content="2">
    `;
    const props = metaProps();
    t.deepEqual(props.foo, ['0', '1', '2']);
});

test('creates object with deep keys and values', (t) => {
    document.head.innerHTML = `
        <meta name="foo:bar" content="bar">
        <meta name="foo:baz:qux" content="qux">
    `;
    const props = metaProps();
    t.deepEqual(props, {
        foo: {
            bar: 'bar',
            baz: { qux: 'qux' },
        },
    });
});

test('warns developer about existing mismatch keys', (t) => {
    document.head.innerHTML = `
        <meta name="foo" content="foo">
        <meta name="foo:bar" content="bar">
    `;
    metaProps();
    t.truthy(console.warn.calledWithMatch(
        sinon.match(/Skipping `foo:bar`/)
    ));
});

test('splits keys with given separator', (t) => {
    document.head.innerHTML = '<meta name="ns.foo" content="foo">';
    const props = metaProps('ns', '.');
    t.is(props.foo, 'foo');
});

test('camelcase the keys', (t) => {
    document.head.innerHTML = '<meta name="foo" content="foo">';
    metaProps();
    t.truthy(camelSpy.calledWith('foo'));
});

test('returns singular value as a getter', (t) => {
    document.head.innerHTML = '<meta name="foo" content="foo">';
    t.is(metaProps('foo'), 'foo');
});

test('returns singular value as a getter for arrays', (t) => {
    document.head.innerHTML = `
        <meta name="foo" content="0">
        <meta name="foo" content="1">
        <meta name="foo" content="2">
    `;
    t.deepEqual(metaProps('foo'), ['0', '1', '2']);
});
