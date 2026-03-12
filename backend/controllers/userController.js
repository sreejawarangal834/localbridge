const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { phone, email, name, role, qualification, occupation } = req.body;
    let user = await prisma.user.findFirst({ 
      where: { OR: [{ phone }, { email: email || undefined }] } 
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { phone, email, name, role: role || 'SEEKER', qualification, occupation }
      });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPhone = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        verificationLevel: 1,
        verificationStatus: 'PENDING'
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
