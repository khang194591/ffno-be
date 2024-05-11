import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import { ContactType, MemberRole, PropertyType } from '../../src/libs';
import {
  fakeMember,
  fakeProperty,
  fakeUnit,
  mockAmenities,
  mockUnitFeatures,
} from './helper';

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.$transaction([
    prisma.request.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.unitPriceLog.deleteMany(),
    prisma.unitFeature.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.equipmentCategory.deleteMany(),
    prisma.equipment.deleteMany(),
    prisma.propertyAmenity.deleteMany(),
    prisma.property.deleteMany(),
    prisma.memberContacts.deleteMany(),
    prisma.member.deleteMany(),
  ]);

  const admin = await prisma.member.create({
    data: fakeMember({
      id: 'eeb06826-843f-4f4f-a298-b1ce3b9a370b',
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.ADMIN,
      name: 'Trịnh Đức Khang',
      imgUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocJ-wyEURnuJjTv_eY9Fgf_KPd4QA75b_A5D06wJ63IB7gKjOUUv=s288-c-no',
    }),
  });

  const members = Array(randomInt(50, 100))
    .fill(0)
    .map(() => fakeMember());

  members.push(
    fakeMember({
      id: '3c8f96f8-57c8-4846-9826-59b1277e9b63',
      email: 'khang.td194591@sis.hust.edu.vn',
      password: hashSync('123456', 10),
      role: MemberRole.TENANT,
      name: 'Trịnh Khang',
      imgUrl: 'https://avatars.githubusercontent.com/u/65625612?s=200&v=4',
    }),
  );

  await prisma.member.createMany({
    data: members,
  });

  await prisma.propertyAmenity.createMany({
    skipDuplicates: true,
    data: mockAmenities.map((name) => ({ name })),
  });

  await prisma.unitFeature.createMany({
    skipDuplicates: true,
    data: mockUnitFeatures.map((name) => ({ name })),
  });

  const properties = Array(randomInt(20, 50))
    .fill(0)
    .map(() => fakeProperty(admin.id));

  const units = properties
    .map(({ id, type }) =>
      type === PropertyType.MULTIPLE_UNIT
        ? Array(randomInt(2, 10))
            .fill(0)
            .map(() => fakeUnit(id))
        : fakeUnit(id),
    )
    .flatMap((i) => i);

  await prisma.$transaction(
    properties.map((property) => prisma.property.create({ data: property })),
  );
  await prisma.$transaction(
    units.map((unit) => prisma.unit.create({ data: unit })),
  );

  const shuffledMembers = members.sort(() => 0.5 - Math.random());
  await prisma.$transaction(
    shuffledMembers.flatMap((member) => [
      prisma.unit.update({
        where: { id: units[randomInt(units.length - 1)].id },
        data: { payerId: member.id, tenants: { connect: { id: member.id } } },
      }),

      prisma.member.update({
        where: {
          id:
            randomInt(10) < 3
              ? admin.id
              : members[randomInt(members.length - 1)].id,
        },
        data: {
          contacts: {
            create: { type: ContactType.TENANT, contactWithId: member.id },
          },
        },
      }),
    ]),
  );

  const contacts = await prisma.memberContacts.findMany({});

  await prisma.memberContacts.createMany({
    skipDuplicates: true,
    data: contacts.map((contact) => ({
      type: ContactType.TENANT,
      contactId: contact.contactWithId,
      contactWithId: contact.contactId,
    })),
  });

  await prisma.unit.updateMany({
    data: { isListing: true },
    where: { payerId: null },
  });
};

const runSeed = async () => {
  let hasError = true;
  do {
    try {
      await seed();
      hasError = false;
    } catch (error) {
      console.error(error);
    }
  } while (hasError);
};

void runSeed();
