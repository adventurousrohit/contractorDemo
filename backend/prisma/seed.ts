import { PrismaClient, Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const db = new PrismaClient();

/* Creating Roles */
const createRoles = async () => {
  await db.roles.createMany({
    data: [
      ...Object.keys(Role).map((role: Role) => ({
        name: role,
      })),
    ],
  });
  console.log('Roles Created Successfully!');
};

/* Create First Super Admin User */
const createFirstSuperAdmin = async () => {
  const email = process.env.FIRST_SUPER_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.FIRST_SUPER_ADMIN_PASSWORD || 'admin123';

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name: 'Super Admin',
      email,
      // username: email,
      password: hashedPassword,
      roles: {
        connect: {
          name: Role.Admin,
        },
      },
    },
  });
  console.log('Super Admin Created Successfully!');
};

/* Create First User */
const createFirstUser = async () => {
  const email = process.env.SIMPLE_USER_EMAIL || 'user@example.com';
  const password = process.env.SIMPLE_USER_PASSWORD || 'user123';

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name: 'Simple User',
      email,
      // username: email,
      password: hashedPassword,
      roles: {
        connect: {
          name: Role.User,
        },
      },
    },
  });
  console.log('User Created Successfully!');
};

const main = async () => {
  await createRoles();
  await createFirstSuperAdmin();
  await createFirstUser()
  // process.env.NODE_ENV === 'test' && (await createTestData());
};

main();
