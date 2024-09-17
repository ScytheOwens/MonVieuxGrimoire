const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const convertImage = (req, res, next) => {
	if (req.file) {
		const webpFilename = req.file.filename.replace(/\.\D+/, ".webp");
		const webpImagePath = path.join("images", webpFilename);

		sharp(req.file.path)
			.webp({ quality: 80 })
			.toFile(webpImagePath)
			.then(() => {
				fs.unlink(req.file.path, () => {
                    req.file.filename = webpFilename;
					next();
				})
			})
	} else {
		next();
	}
};

module.exports = convertImage;
