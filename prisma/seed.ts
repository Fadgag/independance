import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@studio.com'
  const adminName = 'Admin Studio'
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!'

  // Hash password
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  // Ensure there is an organization to attach the user to
  let org = await prisma.organization.findFirst()
  if (!org) {
    org = await prisma.organization.create({ data: { name: 'Salon Test' } })
    console.log('Organization created:', org.id)
  } else {
    console.log('Organization exists:', org.id)
  }

  // Ensure admin user exists (find by email then create or update)
  let user = await prisma.user.findUnique({ where: { email: adminEmail } }).catch(() => null)
  if (!user) {
    user = await prisma.user.create({ data: { email: adminEmail, name: adminName, hashedPassword, organizationId: org.id, role: 'ADMIN' } })
    console.log('Admin user created:', user.email)
  } else {
    user = await prisma.user.update({ where: { id: user.id }, data: { name: adminName, hashedPassword, organizationId: org.id, role: 'ADMIN' } })
    console.log('Admin user updated:', user.email)
  }
  console.log('Password (seed):', plainPassword)

  // Create a staff user for testing roles
  const staffEmail = process.env.SEED_STAFF_EMAIL || 'staff@studio.com'
  const staffName = 'Staff Studio'
  const staffPlain = process.env.SEED_STAFF_PASSWORD || 'Staff123!'
  const hashedStaff = await bcrypt.hash(staffPlain, 10)

  let staffUser = await prisma.user.findUnique({ where: { email: staffEmail } }).catch(() => null)
  if (!staffUser) {
    staffUser = await prisma.user.create({ data: { email: staffEmail, name: staffName, hashedPassword: hashedStaff, organizationId: org.id, role: 'STAFF' } })
    console.log('Staff user created:', staffUser.email)
  } else {
    staffUser = await prisma.user.update({ where: { id: staffUser.id }, data: { name: staffName, hashedPassword: hashedStaff, organizationId: org.id, role: 'STAFF' } })
    console.log('Staff user updated:', staffUser.email)
  }
  console.log('Staff Password (seed):', staffPlain)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())






