import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const id = user_id
    const user = await this.repository.findOneOrFail(id, {
      relations: ['games']
    });

    if (!user) {
      throw new Error('user not found')
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query("SELECT first_name FROM users ORDER BY first_name ASC"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    let firstName = first_name.toLowerCase();
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    let lastName = last_name.toLowerCase();
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    return await this.repository.query(`SELECT * FROM users WHERE first_name = $1 AND last_name = $2`, [firstName, lastName]); // Complete usando raw query
  }
}
