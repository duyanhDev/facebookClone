const path = require("path");

module.exports = {
  uploadSingleFile: async (fileObject) => {
    console.log("check fileObject", fileObject);

    let uploadPath = path.resolve(__dirname, "../public/images/upload");
    // console.log(">>> check fileObject: ", path.resolve(__dirname, "../public/images/upload"))

    // abc.png => abc-timestamp.png
    // console.log("fillt", fileObject);

    //get image extension
    let extName = path.extname(fileObject.name);

    //get image's name (without extension)
    let baseName = path.basename(fileObject.name, extName);

    //create final path: eg: /upload/your-image.png
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;

    // console.log("final path: ", finalPath)

    try {
      await fileObject.mv(finalPath);
      return {
        status: "success",
        path: finalName,
        error: null,
      };
    } catch (err) {
      return {
        status: "failed",
        path: null,
        error: JSON.stringify(err),
      };
    }
  },
};
