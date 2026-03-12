const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.applyToJob = async (req, res) => {
  try {
    const { jobId, seekerId, skills, experience } = req.body;
    
    // Check if user already applied
    const existing = await prisma.application.findUnique({
      where: {
        jobId_seekerId: { jobId, seekerId }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        seekerId,
        skills,
        experience
      }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationsByEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;
    const applications = await prisma.application.findMany({
      where: {
        job: { employerId }
      },
      include: {
        job: true,
        seeker: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
