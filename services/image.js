exports.getByFilename = async (req, res) => {
    return res.sendFile(`images/${req.params.image_path}`, { root: '.' })
}