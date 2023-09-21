import merge from 'ts-deepmerge'

function isObject (val: object): boolean {
  return val != null && typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]'
}

function isPlainObject (o: object): boolean {
  if (Array.isArray(o)) { return true }

  if (!isObject(o)) { return false }

  // If has modified constructor
  const ctor = o.constructor
  if (typeof ctor !== 'function') { return false }

  // If has modified prototype
  const prot = ctor.prototype
  if (!isObject(prot)) { return false }

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (prot.hasOwnProperty('isPrototypeOf') === false) { return false }

  // Most likely a plain Object
  return true
}

/**
 * @internal
 *
 * Override the sensible defaults with user provided props
 */
export function overrideProps (DefaultProps: object, userProps: object, concatArray = false): any {
  if (concatArray) {
    return merge(DefaultProps, userProps, {
      arrayMerge: (destinationArray: string | any[], sourceArray: any) => destinationArray.concat(sourceArray),
      isMergeableObject: isPlainObject
    })
  } else {
    return merge(DefaultProps, userProps, {
      arrayMerge: (_destinationArray: any, sourceArray: any) => sourceArray, // underscore allows arg to be ignored
      isMergeableObject: isPlainObject
    })
  }
}

/**
 * @internal
 *
 * Creates the props to be used to instantiate a CDK L2 construct within a Solutions Construct
 *
 * @param defaultProps The default props to be used by the construct
 * @param clientProps Optional properties passed in from the client in the props object
 * @param constructProps Optional properties required by the construct for the construct to work (override any other values)
 * @returns The properties to use - all values prioritized:
 *  1) constructProps value
 *  2) clientProps value
 *  3) defaultProps value
 */
export function consolidateProps (defaultProps: object, clientProps?: object, constructProps?: object, concatArray = false): any {
  let result: object = defaultProps

  if (clientProps != null) { result = overrideProps(result, clientProps, concatArray) }

  if (constructProps != null) { result = overrideProps(result, constructProps, concatArray) }

  return result
}
