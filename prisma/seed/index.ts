import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import {
  ContactType,
  MemberRole,
  PropertyType,
  UnitStatus,
} from '../../src/libs';
import {
  equipmentCategories,
  fakeContract,
  fakeMember,
  fakeProperty,
  fakeUnit,
  getRandomItemInArray,
  propertyAmenities,
  unitFeatures,
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

  const landlordIds = [
    '2c4378f7-a216-4a31-a891-e1be254ba970',
    '9bc9db59-bcb9-4fcb-91fa-031e8fd2c4f5',
    '411abc4a-4ea1-4b7d-9df3-9f598ada5e62',
  ];

  const landlords = [
    fakeMember({
      id: landlordIds[0],
      email: 'landlord_01@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Landlord 01',
      imgUrl: 'https://avatar.iran.liara.run/public/03',
    }),
    fakeMember({
      id: landlordIds[1],
      email: 'landlord_02@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Landlord 02',
      imgUrl: 'https://avatar.iran.liara.run/public/04',
    }),
    fakeMember({
      id: landlordIds[2],
      email: 'landlord_03@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Landlord 03',
      imgUrl: 'https://avatar.iran.liara.run/public/05',
    }),
  ];

  const tenants = Array.from({ length: randomInt(10) }).map(() => fakeMember());

  const propertyIds = [
    '4d5f4d8c-0c89-40a5-91d4-675cb9e7c9f1',
    '2f7c529a-b7c7-42ad-bbbc-2cb1dc8395f1',
    '1d3b4f3b-3b21-4d7a-a6e7-36c2b2a9db0f',
    'f78d5d39-0173-4de5-baa7-712b8f2b82a7',
    '2e9b4c9b-0b21-47d9-b4a7-2b1c3f9f5b6e',
    'a3f5e7c5-5b3d-4c9a-a5f1-6d2b9c8f7b3d',
    '4c5b2d8c-3e7a-4d8a-9b5f-2d8c5b7a1e7a',
    '7d8a5b9c-4f5e-49b8-9c7a-1b2c8f6a7d3b',
    '5b3e9a8c-2d7f-4d8b-9a5c-3e7d5a8b1c4a',
    '8f7c5b3a-1d6e-4b9a-7d5c-4e3b2a1c9d7e',
  ];

  const unitIds = [
    '1e24c1ff-8148-4a8a-9a65-87f0b28182a4',
    '7e1c251e-3c9f-4d12-b8e9-6561a23e5b07',
    '08c226d8-0c67-4a5c-9829-bb5ff065e3e7',
    '54f5cf7a-d1a2-4b7c-9d9f-8e8471c3e8e4',
    'c8b2c4b1-74e5-4e1e-9d74-d85e6346bcbf',
    'fae14b2e-6f27-4c29-9d67-fb4f232e3b9f',
    'fd4c7f8c-5a8b-4a8e-8e2b-bd7f1a0b6f3a',
    '2d8a5b1f-4d7e-4a9e-8c2f-1a8b4f6e7c3d',
    '7c1f8d9e-2b3a-4f8c-9e7a-5b2c4a8e3f1d',
    '8e5b7c3a-1f4e-4a9e-9c7d-6b3a2d8c1f5e',
    '9f8b6c5d-2e3a-4f9a-8c1b-7a3e5b2c4f6d',
    'a3b2d7c4-5e6a-4b9f-8d2c-1f4a3e7c9b5d',
    'b4c1d8a5-6e7a-4b8c-9f1d-2e3a4d5b7f6c',
    'd8e7c4b3-1f6a-4a9b-8c5e-2b3a5d7f1c4d',
    'f6b7d8a3-2e9c-4b1f-8d3e-7a5c4f2a6b1e',
  ];

  const properties = [
    fakeProperty(landlordIds[0], {
      id: propertyIds[0],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[0], {
      id: propertyIds[1],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[0], {
      id: propertyIds[2],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[1], {
      id: propertyIds[3],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[1], {
      id: propertyIds[4],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[5],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[6],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[7],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[8],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[9],
      province: 'Thành phố Hà Nội',
      district: '',
      ward: '',
      type: PropertyType.SINGLE_UNIT,
      name: '',
      address: '',
      imgUrls: [],
      description: '',
    }),
  ];

  const units = [
    fakeUnit(properties[0], {
      id: unitIds[0],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[1], {
      id: unitIds[1],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[1], {
      id: unitIds[2],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[2], {
      id: unitIds[3],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[2], {
      id: unitIds[4],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[3], {
      id: unitIds[5],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[4], {
      id: unitIds[6],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[4], {
      id: unitIds[7],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[5], {
      id: unitIds[8],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[6], {
      id: unitIds[9],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[7], {
      id: unitIds[10],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[8], {
      id: unitIds[11],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[8], {
      id: unitIds[12],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[8], {
      id: unitIds[13],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
    fakeUnit(properties[9], {
      id: unitIds[14],
      name: '',
      area: 0,
      price: 0,
      deposit: 0,
      description: '',
      status: UnitStatus.GOOD,
      imgUrls: [],
    }),
  ];

  tenants.push(
    fakeMember({
      id: 'c7be62dd-4e32-42a3-b37d-0e9103339668',
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.TENANT,
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
    data: propertyAmenities.map((name) => ({ name })),
  });

  await prisma.unitFeature.createMany({
    skipDuplicates: true,
    data: unitFeatures.map((name) => ({ name })),
  });

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
