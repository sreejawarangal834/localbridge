const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  console.log('Cleaning old data...');
  await prisma.application.deleteMany();
  await prisma.jobReport.deleteMany();
  await prisma.review.deleteMany();
  await prisma.job.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating new seed data...');
  // Create Mock Employer
  const employer = await prisma.user.create({
    data: {
      id: "mock-employer-id",
      phone: '+919876543210',
      name: 'Ravi Kumar',
      role: 'EMPLOYER',
      isVerified: true,
      verificationLevel: 3,
      verificationStatus: 'VERIFIED'
    }
  });

  // Business Profile for Employer
  await prisma.businessProfile.create({
    data: {
      userId: employer.id,
      shopName: 'Varun Enterprises',
      businessType: 'Agency',
      address: 'Warangal Chowrasta',
      lat: 17.9689,
      lng: 79.5941
    }
  });

  const jobsData = [
    { title: 'Pharmacist', category: 'Medical', salary: '₹18,000', location: 'Apollo Pharmacy, Hanamkonda', employerId: employer.id, minQualification: 'Graduate', minExperience: '1 Year+', workingHours: '9 AM - 6 PM', lat: 17.9942, lng: 79.5896 },
    { title: 'Store Assistant', category: 'Retail', salary: '₹12,000', location: 'Reliance Trends, Warangal', employerId: employer.id, minQualification: '12th Pass', minExperience: 'Fresher', workingHours: '10 AM - 9 PM', lat: 17.9689, lng: 79.5941 },
    { title: 'Billing Clerk', category: 'Shopping Mall', salary: '₹14,000', location: 'Nexus Mall, Kukatpally', employerId: employer.id, minQualification: '12th Pass', minExperience: '6 Months+', workingHours: '11 AM - 10 PM', lat: 17.4849, lng: 78.3888 },
    { title: 'Staff Nurse', category: 'Hospitals', salary: '₹22,000', location: 'Sunshine Hospital, Secunderabad', employerId: employer.id, minQualification: 'Graduate', minExperience: '1 Year+', workingHours: '8 AM - 4 PM', lat: 17.4399, lng: 78.4983 },
    { title: 'Delivery Executive', category: 'Delivery', salary: '₹15,000 + Fuel', location: 'Zomato Hub, Madhapur', employerId: employer.id, minQualification: '10th Pass', minExperience: 'Fresher', workingHours: 'Flexible', lat: 17.4483, lng: 78.3915 },
    { title: 'Warehouse Loader', category: 'Warehouse', salary: '₹13,500', location: 'Flipkart Hub, Kazipet', employerId: employer.id, minQualification: 'Below 10th', minExperience: 'Not Needed', workingHours: '10 PM - 6 AM', lat: 17.9737, lng: 79.5316 },
    { title: 'Customer Support', category: 'Call Center', salary: '₹20,000', location: 'Tech Mahindra, Warangal', employerId: employer.id, minQualification: 'Graduate', minExperience: 'Fresher', workingHours: '9 AM - 6 PM', lat: 17.9810, lng: 79.5630 },
    { title: 'Security Guard', category: 'Other', salary: '₹15,000', location: 'Inorbit Mall, Hitech City', employerId: employer.id, minQualification: 'Not Needed', minExperience: '1 Year+', workingHours: '8 PM - 8 AM', lat: 17.4348, lng: 78.3861 },
    { title: 'Sales Girl', category: 'Retail', salary: '₹11,000', location: 'Big Bazaar, Warangal', employerId: employer.id, minQualification: '10th Pass', minExperience: 'Fresher', workingHours: '10 AM - 8 PM', lat: 17.9720, lng: 79.5910 },
    { title: 'Lab Technician', category: 'Medical', salary: '₹16,000', location: 'MedPlus Lab, Subedari', employerId: employer.id, minQualification: 'Graduate', minExperience: '6 Months+', workingHours: '8 AM - 5 PM', lat: 17.9890, lng: 79.5670 },
    { title: 'Housekeeping', category: 'Hospitals', location: 'Rainbow Hospital, Banjara Hills', salary: '₹12,500', employerId: employer.id, minQualification: 'Below 10th', minExperience: 'Not Needed', workingHours: '7 AM - 3 PM', lat: 17.4126, lng: 78.4411 },
    { title: 'Data Entry Operator', category: 'Call Center', salary: '₹18,500', location: 'local BPO office, Hanamkonda', employerId: employer.id, minQualification: '12th Pass', minExperience: '6 Months+', workingHours: '9 AM - 6 PM', lat: 17.9950, lng: 79.5850 },
    { title: 'Forklift Operator', category: 'Warehouse', salary: '₹17,000', location: 'DHL Logistics, Cherlapally', employerId: employer.id, minQualification: '10th Pass', minExperience: '2 Years+', workingHours: '10 AM - 7 PM', lat: 17.4678, lng: 78.6012 },
    { title: 'Receptionist', category: 'Hospitals', salary: '₹15,000', location: 'MGM Hospital, Warangal', employerId: employer.id, minQualification: 'Graduate', minExperience: 'Fresher', workingHours: '9 AM - 5 PM', lat: 17.9790, lng: 79.6010 },
    { title: 'Grocery Packer', category: 'Retail', salary: '₹10,500', location: 'More Supermarket, Hunter Road', employerId: employer.id, minQualification: 'Not Needed', minExperience: 'Not Needed', workingHours: '8 AM - 8 PM', lat: 17.9540, lng: 79.5980 },
    { title: 'Food Delivery', category: 'Delivery', salary: '₹14,000', location: 'Swiggy Delivery Hub, NIT Warangal', employerId: employer.id, minQualification: '10th Pass', minExperience: 'Fresher', workingHours: 'Flexible', lat: 17.9830, lng: 79.5300 },
    { title: 'Floor Manager', category: 'Shopping Mall', salary: '₹25,000', location: 'PVR Cinemas, Hyderabad', employerId: employer.id, minQualification: 'Graduate', minExperience: '2 Years+', workingHours: '10 AM - 11 PM', lat: 17.4840, lng: 78.3950 },
    { title: 'Machine Operator', category: 'Manufacturing', salary: '₹16,500', location: 'Textile Park, Warangal', employerId: employer.id, minQualification: '10th Pass', minExperience: '1 Year+', workingHours: '9 AM - 6 PM', lat: 17.9500, lng: 79.6500 },
    { title: 'Tailor', category: 'Manufacturing', salary: '₹14,000', location: 'Local Boutique, Hanamkonda', employerId: employer.id, minQualification: 'Not Needed', minExperience: '2 Years+', workingHours: '10 AM - 7 PM', lat: 17.9980, lng: 79.5700 },
    { title: 'Office Assistant', category: 'Call Center', salary: '₹19,000', location: 'Genpact Hub, Pocharam', employerId: employer.id, minQualification: 'Graduate', minExperience: 'Fresher', workingHours: '9 AM - 6 PM', lat: 17.4600, lng: 78.6800 },
    { title: 'Security Guard', category: 'Other', salary: '₹13,000', location: 'GVK One Mall, Hyderabad', employerId: employer.id, minQualification: 'Not Needed', minExperience: 'Fresher', workingHours: '8 AM - 8 PM', lat: 17.4190, lng: 78.4480 }
  ];

  console.log('Inserting new jobs...');
  for (const job of jobsData) {
    await prisma.job.create({ data: job });
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
