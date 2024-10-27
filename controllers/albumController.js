import sequilize from "sequelize";
import { Album } from "../models/Album.js";

export const createAlbum = async (req, res) => {
  const album  = await Album.create({
    user_id: req.user.user_id,
    name: req.body.name,
    image: req?.file?.path ? `${process.env.IMAGE_HOST}/${req.file.path}` : '' ,
  })
  res.status(200).json({ album })
}

export const getAlbums = async (req, res) => {
  const nameFilter = req.query?.name;
  const searchObject =  { where: { user_id: req.user.user_id } };

  if (nameFilter) {
    searchObject.where.name = { [sequilize.Op.like]: `%${nameFilter}%` }
  }

  if (req.query?.offset && req.query?.limit) {
    searchObject.limit = req.query.limit;
    searchObject.offset = req.query.offset
  }

  if (req.query?.sortBy) {
    const parts = req.query.sortBy.split(':');
    searchObject.order = [[parts[0], parts[1]]]
  }

  const { rows: albums, count } = await Album.findAndCountAll(searchObject)
  res.status(200).json({ albums, count })
}

export const deleteAlbum = async (req, res) => {
  const album = await Album.destroy({ where: { id: req.params.id, user_id: req.user.user_id } })
  res.status(200).json({ album })
}

export const updateAlbum = async (req, res) => {
  const album = await Album.update({
    name: req.body.name,
    image: req?.file?.path ? `${process.env.IMAGE_HOST}/${req.file.path}` : '',
  }, { where: { id: req.params.id, user_id: req.user.user_id } })
  res.status(200).json({ album })
}