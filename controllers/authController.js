import { User } from "../models/User.js";
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from "../helpers/auth.js";
import * as crypto from "crypto";
import { codeSend } from "../helpers/mail.js";
import jwt from "jsonwebtoken";
import 'dotenv/config'


export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400);
      return res.json({ error: 'email обязателен' })
    }

    if (!password) {
      res.status(400);
      return res.json({ error: 'пароль обязателен' })
    }

    if ((await User.findAll({
      where: {
        email: email
      }
    })).length > 0) {
      res.status(400);
      return res.json({ error: 'Такой пользователь уже есть' });
    }
    //TODO
    //остальная валидация

    const hashedPassword = await hashPassword(password);
    const code = crypto.randomInt(100000, 999999);
    // const date = new Date();
    // const codeDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const codeDate = Date.now();

    const user = await User.create({ ...req.body, password: hashedPassword, code, code_date: codeDate });
    await codeSend(email, code).catch(console.error);
    return res.json({ id: user.dataValues.user_id });
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}

export const verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if ((Date.now() - user.code_date) / 1000 > 15 * 60) {
      res.status(400);
      return res.json({ error: 'код устарел' });
    }
    if (code === user.code) {
      user.status = 'activate';
      await user.save();
      return res.sendStatus(200);
    }

    res.status(400);
    return res.json({ error: 'Неправильный код' });
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}

export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(400);
      return res.json({ error: 'Такого пользователя не существует.' })
    }
    const code = crypto.randomInt(100000, 999999);
    user.code = code;
    user.code_date = Date.now();
    user.save();
    await codeSend(email, code).catch(console.error);
    return res.sendStatus(200);
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400);
      return res.json({ error: 'email обязятелен' })
    }

    if (!password) {
      res.status(400);
      return res.json({ error: 'пароль обязятелен' })
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(400);
      return res.json({ error: 'Такого пользователя не существует', field: 'email' });
    }
    const isPasswordValid = await comparePassword(password, user.dataValues.password.trim());

    if (!isPasswordValid) {
      res.status(400);
      return res.json({ error: 'Неправильный пароль', field: 'password' });
    }

    const accessToken = await generateAccessToken(user.dataValues.user_id, email);
    const refreshToken = await generateRefreshToken(user.dataValues.user_id, email);
    res.cookie('refreshToken', refreshToken, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json({ accessToken });
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}

export const checkAccessToken = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        errorCode: 'EMPTY_BODY'
      })
    }

    let userData = null;
    try {
      userData = jwt.verify(accessToken, process.env.JWT_SECRET)
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          errorCode: 'EXPIRED_TOKEN'
        });
      }
      return res.status(401).json({
        errorCode: 'INVALID_ERROR'
      })
    }

    const user = await User.findOne({ where: { user_id: +userData.user_id } })

    return res.status(200).json({
      user,
    })
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}


export const refreshToken = async (req, res) => {
  try {
    let user;
    if (!req.cookies.refreshToken) {
      res.status(400);
      return res.json({ error: 'в куках нет рефреш токена' });
    }
    await jwt.verify(req.cookies.refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(400);
        return res.json({ error: 'токен не валиден, необходимо войти еще раз' });
      }
      user = await User.findOne({ where: { user_id: +decoded.user_id } });
    })
    const accessToken = await generateAccessToken(user.dataValues.user_id, user.dataValues.email);
    const refreshToken = await generateRefreshToken(user.dataValues.user_id, user.dataValues.email);
    res.cookie('refreshToken', refreshToken, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json({ accessToken });
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}


export const passwordUpdate = async (req, res) => {
  try {
    const { newPassword, currentPassword } = req.body;
    // const user = await User.findOne({ where: { email: email } });
    // if ((Date.now() - user.code_date) / 1000 > 15 * 60) {
    //   res.status(400);
    //   return res.json({ error: 'код устарел' });
    // }
    // if (code !== user.code) {
    //   res.status(400)
    //   return res.json({ error: 'Неправильный код' })
    // }
    // console.log(newPassword)



    const hashedCurrentPassword = await hashPassword(currentPassword);
    console.log('pasd', req.user.password)
    if (req.user.password.trim() !== hashedCurrentPassword) {
      return res.status(400).json({
        errorCode: 'INVALID_PASSWORD'
      })
    }

    req.user.password = await hashPassword(newPassword)
    req.user.save();
    return res.status(200).json({
      user: req.user
    })
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}

export const updateUser = async (req, res) => {
  try {
    const { first_name, second_name, email } = req.body;

    const userWithEmail = await User.findOne({ where: { email: email } });
    if (userWithEmail && userWithEmail.user_id !== req.user.user_id) {
      return res.status(400).json({ errorCode: 'USER_WITH_EMAIL_ALREADY_EXIST' });
    }

    try {
      await User.update({ first_name, second_name, email }, { where: { user_id: req.user.user_id } });
      const updatedUser = await User.findOne({ where: { user_id: req.user.user_id } });
      return res.status(200).json({
        user: updatedUser
      });

    } catch (cause) {
      return res.status(400).json({
        errorCode: 'INVALID_DATA',
      });
    }
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}

export const updateAvatar = async (req, res) => {
  try {
    console.log(req.file)
    const avatar = req.file;
    const user = await User.findOne({ where: { user_id: req.user.user_id } });
    user.avatar = `${process.env.IMAGE_HOST}/${avatar.path}`;
    await user.save();
    return res.status(200).json({ user });
    } catch (error) {
    next(error); // Передаём ошибку в глобальный обработчик
  }
}