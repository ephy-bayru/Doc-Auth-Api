import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../entities/address.entity';

export class UsersResponseDTO {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: '0x123abc...',
    description: 'The Ethereum address of the user',
    required: false,
  })
  ethereumAddress?: string;

  @ApiProperty({
    type: Address,
    description: 'The address associated with the user',
  })
  address: Address;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The creation date of the user record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'The last update date of the user record',
  })
  updatedAt: Date;
}
