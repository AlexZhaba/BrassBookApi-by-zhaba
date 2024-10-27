import { Album } from "../models/Album.js";

export const createAlbum = async (req, res) => {
  const album  = await Album.create({
    user_id: req.user.user_id,
    name: req.body.name,
    image: `${process.env.IMAGE_HOST}/${req.file.path}`,
  })
  res.status(200).json({ album })
}

export const getAlbums = async (req, res) => {
  const albums = await Album.findAll({ where: { user_id: req.user.user_id } })
  res.status(200).json({ albums })
}

export const deleteAlbum = async (req, res) => {
  const album = await Album.destroy({ where: { id: req.params.id, user_id: req.user.user_id } })
  res.status(200).json({ album })
}

export const updateAlbum = async (req, res) => {
  const album = await Album.update({
    name: req.body.name,
    image: `${process.env.IMAGE_HOST}/${req.file.path}`,
  }, { where: { id: req.params.id, user_id: req.user.user_id } })
  res.status(200).json({ album })
}