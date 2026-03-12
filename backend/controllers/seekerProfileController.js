const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.seekerProfile.findUnique({
      where: { userId },
      include: { user: true }
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { resumeUrl, skills, portfolioUrl, experienceYears, alertsEnabled } = req.body;

    const profile = await prisma.seekerProfile.upsert({
      where: { userId },
      update: {
        resumeUrl,
        skills,
        portfolioUrl,
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
        alertsEnabled: alertsEnabled !== undefined ? Boolean(alertsEnabled) : false
      },
      create: {
        userId,
        resumeUrl,
        skills,
        portfolioUrl,
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
        alertsEnabled: alertsEnabled !== undefined ? Boolean(alertsEnabled) : false
      }
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
