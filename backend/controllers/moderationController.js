const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res) => {
  try {
    const { employerId, seekerId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { employerId, seekerId, rating: parseInt(rating), comment }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reportJob = async (req, res) => {
  try {
    const { jobId, reporterId, reason, details } = req.body;
    
    // Check if the job should be auto-flagged based on report volume (mock logic)
    const reportCount = await prisma.jobReport.count({ where: { jobId } });
    if (reportCount >= 2) {
      await prisma.job.update({
        where: { id: jobId },
        data: { isFlagged: true }
      });
    }

    const report = await prisma.jobReport.create({
      data: { jobId, reporterId, reason, details }
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getModerationData = async (req, res) => {
  try {
    const flaggedJobs = await prisma.job.findMany({
      where: { isFlagged: true },
      include: { employer: true, reports: true }
    });
    const pendingVerifications = await prisma.user.findMany({
      where: { verificationStatus: 'PENDING' },
      include: { businessProfile: true }
    });
    res.json({ flaggedJobs, pendingVerifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
