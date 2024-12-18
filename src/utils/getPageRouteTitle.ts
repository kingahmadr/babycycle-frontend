import { capitalize } from './capitalize'

export const getPageRouteTitle = (title: string, path: string): string => {
  const pathSegments = path.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const firstSegment = capitalize(pathSegments[0])
    return `${title} - ${firstSegment}`
  }
  return title
}