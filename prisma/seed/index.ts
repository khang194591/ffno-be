import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import { ContactType, MemberRole, PropertyType } from '../../src/libs';
import {
  fakeContract,
  fakeMember,
  fakeProperty,
  fakeUnit,
  getRandomItemInArray,
  mockAmenities,
  mockUnitFeatures,
} from './helper';

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.$transaction([
    prisma.contract.deleteMany(),
    prisma.memberReceiveRequest.deleteMany(),
    prisma.request.deleteMany(),
    prisma.invoiceItem.deleteMany(),
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

  await prisma.member.create({
    data: fakeMember({
      id: 'eeb06826-843f-4f4f-a298-b1ce3b9a370b',
      email: 'admin@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.ADMIN,
      name: 'Admin',
      imgUrl: 'https://avatar.iran.liara.run/public/02',
    }),
  });

  const landlords = Array.from({ length: randomInt(5, 10) }).map(() =>
    fakeMember({ role: MemberRole.LANDLORD }),
  );

  const tenants = Array.from({ length: randomInt(100, 400) }).map(() =>
    fakeMember(),
  );

  landlords.push(
    fakeMember({
      id: 'c7be62dd-4e32-42a3-b37d-0e9103339668',
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Khang Trịnh',
      imgUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocJ-wyEURnuJjTv_eY9Fgf_KPd4QA75b_A5D06wJ63IB7gKjOUUv=s288-c-no',
    }),
  );

  tenants.push(
    fakeMember({
      id: '3c8f96f8-57c8-4846-9826-59b1277e9b63',
      email: 'khang.td194591@sis.hust.edu.vn',
      password: hashSync('123456', 10),
      role: MemberRole.TENANT,
      name: 'Trịnh Khang',
      imgUrl: 'https://avatar.iran.liara.run/public/03',
    }),
  );

  await prisma.member.createMany({
    skipDuplicates: true,
    data: [...tenants, ...landlords],
  });

  await prisma.propertyAmenity.createMany({
    skipDuplicates: true,
    data: mockAmenities.map((name) => ({ name })),
  });

  await prisma.unitFeature.createMany({
    skipDuplicates: true,
    data: mockUnitFeatures.map((name) => ({ name })),
  });

  const properties = Array.from({ length: randomInt(20, 50) }).map(() =>
    fakeProperty(getRandomItemInArray(landlords).id),
  );

  properties.push(
    fakeProperty('c7be62dd-4e32-42a3-b37d-0e9103339668'),
    fakeProperty('c7be62dd-4e32-42a3-b37d-0e9103339668'),
  );

  const units = properties
    .map(({ id, type }) =>
      type === PropertyType.MULTIPLE_UNIT
        ? Array.from({ length: randomInt(2, 20) }).map(() => fakeUnit(id))
        : fakeUnit(id),
    )
    .flatMap((i) => i);

  await prisma.$transaction(
    properties.map((property) => prisma.property.create({ data: property })),
  );

  const createdUnits = await prisma.$transaction(
    units.map((unit) =>
      prisma.unit.create({ data: unit, include: { property: true } }),
    ),
  );

  const shuffledMembers = tenants.sort(() => 0.5 - Math.random());

  await prisma.$transaction(
    shuffledMembers.flatMap((member) => {
      const unit = getRandomItemInArray(createdUnits);
      return [
        prisma.unit.update({
          where: { id: unit.id },
          data: { payerId: member.id, tenants: { connect: { id: member.id } } },
        }),

        prisma.member.update({
          where: { id: unit.property.ownerId },
          data: {
            contacts: {
              create: { type: ContactType.TENANT, contactWithId: member.id },
            },
          },
        }),

        prisma.contract.create({
          data: fakeContract(
            unit.property.ownerId,
            member.id,
            unit.id,
            unit.price,
            unit.deposit,
          ),
        }),
      ];
    }),
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
