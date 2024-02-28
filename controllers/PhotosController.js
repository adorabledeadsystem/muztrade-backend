import PhotosModel from "../models/Photos.js";

export const create = async (req, res) => {
  try {
    const doc = new PhotosModel({
      imageUrl: req.body.imageUrl,
      date: req.body.date,
      summary: req.body.summary,
    });

    const photos = await doc.save();

    res.json(photos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать событие",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const photosId = req.params.id;

    PhotosModel.findById(
      {
        _id: photosId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Не удалось получить картинку",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Картинки не найдена",
          });
        }

        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить картинку",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const allPhotos = await PhotosModel.find();

    res.json(allPhotos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить события",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const photosId = req.params.id;

    PhotosModel.findOneAndDelete(
      {
        _id: photosId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Не удалось удалить событие",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Событие не найдена",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить события",
    });
  }
};

export const update = async (req, res) => {
  try {
    const photosId = req.params.id;
    await PhotosModel.updateOne(
      {
        _id: photosId,
      },
      {
        imageUrl: req.body.imageUrl,
        date: req.body.date,
        summary: req.body.summary,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить событие",
    });
  }
};
