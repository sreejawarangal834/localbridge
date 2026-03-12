const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.businessProfile.findUnique({
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
    const { shopName, businessType, address, gstNumber, lat, lng, storePhoto } = req.body;

    const profile = await prisma.businessProfile.upsert({
      where: { userId },
      update: {
        shopName,
        businessType,
        address,
        gstNumber,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        storePhoto
      },
      create: {
        userId,
        shopName,
        businessType,
        address,
        gstNumber,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        storePhoto
      }
    });

    // Automatically bump verification level to 2 if shop details are provided
    await prisma.user.update({
      where: { id: userId },
      data: { 
        verificationLevel: { set: 2 },
        verificationStatus: 'PENDING' 
      }
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
