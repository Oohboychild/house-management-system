import { prisma } from '../config/prisma.js';
import { CreatePropertyInput, UpdatePropertyInput } from '../validators/property.validator.js';
import { Role } from '@prisma/client';

export class PropertyService {
  async create(landlordId: string, data: CreatePropertyInput) {
    return prisma.property.create({
      data: {
        ...data,
        landlordId,
      },
      include: {
        landlord: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, role: Role) {
    // Admins see everything, Landlords see only their properties
    if (role === Role.ADMIN) {
      return prisma.property.findMany({
        where: { isActive: true },
        include: {
          landlord: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          units: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.property.findMany({
      where: {
        landlordId: userId,
        isActive: true,
      },
      include: {
        units: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string, role: Role) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        units: true,
      },
    });

    if (!property || !property.isActive) {
      throw new Error('Property not found');
    }

    // Only Admin or the owner can view
    if (role !== Role.ADMIN && property.landlordId !== userId) {
      throw new Error('You do not have permission to view this property');
    }

    return property;
  }

  async update(id: string, userId: string, role: Role, data: UpdatePropertyInput) {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property || !property.isActive) {
      throw new Error('Property not found');
    }

    if (role !== Role.ADMIN && property.landlordId !== userId) {
      throw new Error('You do not have permission to update this property');
    }

    return prisma.property.update({
      where: { id },
      data,
      include: {
        landlord: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async delete(id: string, userId: string, role: Role) {
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property || !property.isActive) {
      throw new Error('Property not found');
    }

    if (role !== Role.ADMIN && property.landlordId !== userId) {
      throw new Error('You do not have permission to delete this property');
    }

    // Soft delete
    return prisma.property.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const propertyService = new PropertyService();