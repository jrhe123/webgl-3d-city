import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxLoader = new FBXLoader()
export const loadFBX = (url) => {
  return new Promise((resolve, reject) => {
    fbxLoader.load(
      url,
      (obj) => {
        resolve(obj)
      },
      () => {
        // console.log('on progress..')
      },
      (error) => {
        reject(error)
      }
    )
  })
}
