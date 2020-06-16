import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// Get all users
router.get('/', [], UserController.getAllUsers);

// Get one user
router.get('/:id([0-9]+)', [], UserController.getUser);

// Create a new user
router.post('/', [], UserController.createUser);

// Edit one user
router.patch('/:id([0-9]+)', [], UserController.updateUser);

// Delete one user
router.delete('/:id([0-9]+)', [], UserController.deleteUser
);

export default router;