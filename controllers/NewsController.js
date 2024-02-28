import NewsModel from "../models/News.js";

export const create = async (req, res) => {
  try {
    const doc = new NewsModel({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      date: req.body.date,
      summary: req.body.summary,
      description: req.body.description,
    });
    const news = await doc.save();

    res.json(news);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать событие",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const allNews = await NewsModel.find();

    res.json(allNews);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить события",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const newsId = req.params.id;

    NewsModel.findOneAndDelete(
      {
        _id: newsId,
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

export const getOne = async (req, res) => {
  try {
    const newsId = req.params.id;

    NewsModel.findById(
      {
        _id: newsId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Не удалось получить новость",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Новость не найдена",
          });
        }

        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить новость",
    });
  }
};

export const update = async (req, res) => {
  try {
    const newsId = req.params.id;
    await NewsModel.updateOne(
      {
        _id: newsId,
      },
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        date: req.body.date,
        summary: req.body.summary,
        description: req.body.description,
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
