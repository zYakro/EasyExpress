import db from 'mime-db'

const getTypes = () => {
  const mimeTypes: Record<string, string> = {}

  for (const [mime, mimeInfo] of Object.entries(db)) {
    if (mimeInfo.extensions) {
      for (const extension of mimeInfo['extensions']) {
        mimeTypes[extension] = mime
      }
    }
  }

  return mimeTypes
}

export const types = getTypes()

export const getContentType = (fileName: string) => {
  const extension = fileName.slice(fileName.lastIndexOf('.') + 1)

  const contentType = types[extension]

  return (contentType) ? contentType : null
}