export default class Path {
  // dynamicPath is a dynamic path such as /foo/:bar
  // path is the static path such as /foo/123
  static compare(dynamicPath: string, path: string) {
    const dynamicPathSegments = dynamicPath.split('/');
    const pathSegments = path.split('/');

    // Early exit if the number of segments doesn't match
    if (dynamicPathSegments.length !== pathSegments.length) {
      return false;
    }

    return dynamicPathSegments.every((dynamicSegment, index) => {
      const staticSegment = pathSegments[index];
      // If it's a dynamic segment (e.g., :bar), it always matches
      return dynamicSegment.startsWith(':') || dynamicSegment === staticSegment;
    });
  }

  static parseParams(dynamicUrl: string, staticUrl: string): Record<string, string> {
    const params: Record<string, string> = {};
    const dynamicUrlSegments = dynamicUrl.split('/');
    const staticUrlSegments = staticUrl.split('/');

    dynamicUrlSegments.forEach((segment, index) => {
      if (segment.startsWith(':')) {
        const variable = segment.slice(1); // Remove ':' prefix
        params[variable] = staticUrlSegments[index];
      }
    });

    return params;
  }
}