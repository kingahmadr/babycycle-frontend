// import { capitalize } from './capitalize'

// export const getPageRouteTitle = (title: string, path: string): string => {
//   const pathSegments = path.split('/').filter(Boolean)
//   if (pathSegments.length > 0) {
//     const firstSegment = capitalize(pathSegments[0])
//     return `${title} - ${firstSegment}`
//   }
//   return title
// }


import { capitalize } from './capitalize';

export const getPageRouteTitle = (title: string, path: string): string => {
  // Split the path into segments and filter out empty strings
  const pathSegments = path.split('/').filter(Boolean);

  // If there are path segments, capitalize the first segment and return the formatted title
  if (pathSegments.length > 0) {
    const firstSegment = capitalize(pathSegments[0]); // Ensure `capitalize` returns a string
    return `${title} - ${firstSegment}`;
  }

  // If no segments are found, return the base title
  return title;
};
