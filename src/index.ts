import { get, kebabCase, set } from './utils';

export const END = Symbol('END');

type IsParameter<T> = T extends `:${string}` ? true : false;
type Empty = Record<string, never>;
type Endable = { [END]: any };

export type Path<T> = {
  [K in keyof T as K extends `:${infer R}` ? R : K]: IsParameter<K> extends true
    ? ((value: string) => Path<T[K]>) & Path<T[K]>
    : Path<T[K]>;
};

const CURRENT_PATH_KEY = Symbol('__GET_CURRENT_PATH__');

export function createPath<T extends object>(paths: T, prefix = ''): Path<T> {
  return new Proxy(
    { paths, prefix },
    {
      get(target, path: string) {
        if (Object.is(path, CURRENT_PATH_KEY)) {
          return target.prefix || '/';
        }
        if (get(target.paths, `:${path}`)) {
          const withParam = (value: string) =>
            createPath(get(target.paths, `:${path}`) as object, `${target.prefix}/${value}`);
          set(withParam, CURRENT_PATH_KEY, `${target.prefix}/:${path}`);
          return withParam;
        }
        const currentPath = `${target.prefix}/${kebabCase(path)}`;
        const nextPaths = get(target.paths, path);
        if (!nextPaths) {
          throw new Error(`Unknown path: ${currentPath}`);
        }
        return createPath(nextPaths, currentPath);
      }
    }
  ) as any;
}

export function build(path: Path<Endable | Empty> | ((value: string) => Path<Empty | Endable>)): string {
  return get(path, CURRENT_PATH_KEY);
}
