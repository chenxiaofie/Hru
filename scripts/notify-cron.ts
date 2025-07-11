const { PrismaClient } = require("@prisma/client");
const { sendMail } = require("../src/lib/email");

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { contacts: true } });
  const now = new Date();
  for (const user of users) {
    if (!user.contacts.length) continue;
    const contact = user.contacts[0];
    const lastVisit = await prisma.visitLog.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });
    if (
      !lastVisit ||
      now.getTime() - lastVisit.date.getTime() > 1 * 60 * 1000
    ) {
      const subject = "hru 紧急提醒";
      const text = `您好，您的亲友 ${contact.name} 已连续1分钟未打卡，请及时关注其情况。\n（本邮件为系统自动发送，请勿回复）`;
      try {
        await sendMail({
          to: contact.email,
          subject,
          text,
        });
        console.log(`已通知 ${contact.email} 关于用户${contact.name}`);
      } catch (e) {
        console.error(`通知 ${contact.email} 失败:`, e);
      }
    }
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
