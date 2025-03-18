// controllers/user.controller.js
const userService = require('../services/user.service');
const validateInputData = require('../utils/validateInputData.util');

const getAllUsers = async (req, res, next) => {
  // #swagger.tags = ['User']
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const getUserByIdOrEmail = async (req, res, next) => {
  // #swagger.tags = ['User']
  try {
    const { idOrEmail } = req.params;

    let user;
    if (/^\d+$/.test(idOrEmail)) {
      user = await userService.getUserById(idOrEmail);
    } else {
      if (!validateInputData.isValidEmail(idOrEmail)) {
        return res.status(400).json({ message: 'O email é obrigatório.' });
      }
      user = await userService.getUserByEmail(idOrEmail);
    }
    if (!user) {
      return res.status(404).json({ message: 'Utilizador nao encontrado.' });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  // #swagger.tags = ['User']
  const { first_name, last_name, email } = req.body;

  const data = { first_name, last_name, email };

  if (first_name && !validateInputData.isValidString(first_name)) {
    return res.status(400).json({ message: 'O nome é obrigatório.' });
  }

  if (last_name && !validateInputData.isValidString(last_name)) {
    return res.status(400).json({ message: 'O sobrenome é obrigatório.' });
  }

  if (email && !validateInputData.isValidEmail(email)) {
    return res.status(400).json({ message: 'O email é obrigatório.' });
  }

  try {
    const updatedUser = await userService.updateUser(req.params.id, data);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    res.status(200).json({ updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  // #swagger.tags = ['User']
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    res.status(204).json({ message: 'Utilizador apagado com sucesso.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserByIdOrEmail,
  updateUser,
  deleteUser,
};
