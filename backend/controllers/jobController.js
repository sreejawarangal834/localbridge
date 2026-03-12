const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getJobs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: { name: true, phone: true, isVerified: true, verificationLevel: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, category, salary, location, lat, lng, workingHours, description, requiredDocs, minQualification, minExperience, employerId } = req.body;
    
    // Basic Fake Job Detection logic
    let isFlagged = false;
    
    // 1. Unreasonable Salary Detection (Simple check for high numbers in text)
    const salaryMatch = salary?.match(/(\d+)/g);
    if (salaryMatch) {
      const maxVal = Math.max(...salaryMatch.map(Number));
      if (maxVal > 100000 && (title.toLowerCase().includes('helper') || title.toLowerCase().includes('cleaning'))) {
        isFlagged = true;
      }
    }

    // 2. Missing location
    if (!location || location.trim().length < 5) {
      isFlagged = true;
    }

    const job = await prisma.job.create({
      data: {
        title,
        category,
        salary,
        location,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        workingHours,
        description,
        requiredDocs,
        minQualification: minQualification || "Not Needed",
        minExperience: minExperience || "Not Needed",
        isFlagged,
        employerId
      }
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.incrementJobViews = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } }
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find past application categories
    const pastApps = await prisma.application.findMany({
      where: { seekerId: userId },
      include: { job: true }
    });

    const categories = [...new Set(pastApps.map(app => app.job.category))];

    // Find jobs in same categories or recently posted
    const recommendations = await prisma.job.findMany({
      where: {
        OR: [
          { category: { in: categories } },
          { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Last 7 days
        ]
      },
      include: {
        employer: { select: { name: true } }
      },
      take: 5
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
