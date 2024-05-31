import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { ContactType, MemberRole, PropertyType } from '../../src/libs';
import equipmentCategories from './data/equipment-category.json';
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
    prisma.review.deleteMany(),
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

  await prisma.equipmentCategory.createMany({
    skipDuplicates: true,
    data: equipmentCategories.map((name) => ({ name })),
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
          data: {
            payerId: member.id,
            tenants: { connect: { id: member.id } },
            reviews: {
              create: {
                rating: randomInt(1, 6),
                comment: faker.lorem.sentence(),
                authorId: member.id,
              },
            },
          },
        }),
        prisma.member.update({
          where: { id: unit.property.ownerId },
          data: {
            contacts: {
              create: { type: ContactType.TENANT, contactWithId: member.id },
            },
          },
        }),
        prisma.member.update({
          where: { id: member.id },
          data: {
            sentReviews:
              randomInt(10) < 8
                ? {
                    createMany: {
                      data: {
                        rating: randomInt(1, 6),
                        comment: faker.lorem.sentence(),
                        propertyId: unit.propertyId,
                      },
                      skipDuplicates: true,
                    },
                  }
                : undefined,
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

  const activeContracts = await prisma.contract.findMany({
    where: { status: 'ACTIVE' },
    include: {
      unit: true,
    },
  });

  await Promise.all(
    activeContracts.map(async (contract) => {
      const startOfMonth = dayjs().startOf('month');
      // eslint-disable-next-line prefer-const
      let { startDate, unit } = contract;
      let prevWater = 0;
      let prevElectric = 0;
      let currentWater = randomInt(1, 5);
      let currentElectric = randomInt(50, 150);
      await prisma.unitPriceLog.updateMany({
        where: {
          unitId: unit.id,
        },
        data: {
          createdAt: contract.startDate,
          updatedAt: contract.startDate,
        },
      });
      while (dayjs(startDate).startOf('month').isBefore(startOfMonth)) {
        const month = dayjs(startDate).format('MM/YYYY');
        await prisma.unitPriceLog.createMany({
          data: [
            {
              category: 'WATER',
              price: 40000,
              status: 0,
              value: +currentWater,
              unitId: unit.id,
              createdAt: dayjs(startDate).endOf('month').toDate(),
              updatedAt: dayjs(startDate).endOf('month').toDate(),
            },
            {
              category: 'ELECTRICITY',
              price: 4000,
              status: 0,
              value: +currentElectric,
              unitId: unit.id,
              createdAt: dayjs(startDate).endOf('month').toDate(),
              updatedAt: dayjs(startDate).endOf('month').toDate(),
            },
          ],
        });
        await prisma.invoice.create({
          data: {
            category: 'MERGED',
            dueDate: dayjs(startDate).endOf('month').add(2, 'week').toDate(),
            status: 'PAID',
            total: unit.price.add(
              (currentElectric - prevElectric) * 4000 +
                (currentWater - prevWater) * 40000,
            ),
            unitId: unit.id,
            memberId: unit.payerId,
            items: {
              createMany: {
                data: [
                  {
                    amount: 1,
                    price: unit.price,
                    description: `Unit lease charge ${month}`,
                  },
                  {
                    amount: currentWater - prevWater,
                    price: 40000,
                    description: `Water fee ${month}`,
                  },
                  {
                    amount: currentElectric - prevElectric,
                    price: 4000,
                    description: `Electric fee ${month}`,
                  },
                ],
              },
            },
          },
        });
        startDate = dayjs(startDate).startOf('month').add(1, 'month').toDate();
        prevWater = currentWater;
        prevElectric = currentElectric;
        currentWater += randomInt(1, 5);
        currentElectric += randomInt(50, 150);
      }
    }),
  );
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
