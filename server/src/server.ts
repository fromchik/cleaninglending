import { config } from "./config.js";
import { createApp } from "./app.js";
import { createDatabase } from "./db/database.js";
import { LeadService } from "./leads/lead.service.js";
import { createTelegramAdmin } from "./telegram/bot.js";

const db = createDatabase(config.databasePath);
const leadService = new LeadService(db);
const telegramNotifier = createTelegramAdmin({
  token: config.telegramBotToken,
  adminChatId: config.telegramAdminChatId,
  leadService
});
const app = createApp({ leadService, telegramNotifier });

app.listen(config.port, () => {
  console.log(`Cleaning API is running on http://localhost:${config.port}`);
});
