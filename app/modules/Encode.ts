import * as zlib from "zlib";

export const gzipEncode = (data: string) => {
    let encodedData: any = ""

    zlib.gzip(data, (err, compressedData) => {
      if(err){
        return;
      }

      encodedData = compressedData;
    })

    return encodedData;
  }