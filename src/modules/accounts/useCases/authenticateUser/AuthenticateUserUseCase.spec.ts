import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate user', async () => {
    const user: ICreateUserDTO = {
      name: 'User Test',
      password: '1234',
      email: 'user@example.com',
      drive_license: '12345',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: 'user@example.com',
      password: '1234',
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate user if not exists', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@example.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'User Test Error',
        email: 'user@user.com',
        password: '1234',
        drive_license: '12345',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectpassword',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
