import assert from 'node:assert';
import { describe, it } from 'node:test';
import { build, createPath, END } from '~/index';

describe('Path Builder Tests', () => {
  it('should build path', () => {
    const $ = createPath({ projects: { list: { [END]: true } } });
    const path = build($.projects.list);

    assert.strictEqual(path, '/projects/list');
  });

  it('should build root path', () => {
    const $ = createPath({ [END]: true, projects: { list: { [END]: true } } });
    const path = build($);

    assert.strictEqual(path, '/');
  });

  it('should build root path with prefix', () => {
    const prefix = '/the/prefix';
    const $ = createPath({ [END]: true, projects: { list: { [END]: true } } }, prefix);
    const path = build($);

    assert.strictEqual(path, '/the/prefix');
  });

  it('should build path with prefix', () => {
    const prefix = '/the/prefix';
    const $ = createPath({ projects: { list: { [END]: true } } }, prefix);
    const path = build($.projects.list);

    assert.strictEqual(path, '/the/prefix/projects/list');
  });

  it('should build path with parameter', () => {
    const $ = createPath({ users: { ':id': { [END]: true } } });
    const path = build($.users.id('123'));

    assert.strictEqual(path, '/users/123');
  });

  it('should build path at the endable position', () => {
    const $ = createPath({ projects: { [END]: true, outdated: { [END]: true } } });
    const path = build($.projects);

    assert.strictEqual(path, '/projects');
  });

  it('should build path template', () => {
    const $ = createPath({ users: { ':id': { [END]: true } } });
    const path = build($.users.id);

    assert.strictEqual(path, '/users/:id');
  });

  it('should throw when trying to get unknown path', () => {
    const $ = createPath({ users: { ':id': { [END]: true } } });

    assert.throws(
      () => {
        build(($.users as any).qwq);
      },
      { message: 'Unknown path: /users/qwq' }
    );
  });

  it('should build correct path with camel case', () => {
    const $ = createPath({ notFound: { [END]: true } });
    const path = build($.notFound);

    assert.strictEqual(path, '/not-found');
  });

  it('should build path when no END specified but next path is empty', () => {
    const $ = createPath({ a: { b: {}, ':c': {} } });

    assert.strictEqual(build($.a.b), '/a/b');
    assert.strictEqual(build($.a.c), '/a/:c');
    assert.strictEqual(build($.a.c('1')), '/a/1');
  });
});
