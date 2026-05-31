type TelegramLikeError = {
  code?: unknown;
  response?: {
    statusCode?: unknown;
    body?: unknown;
  };
  message?: unknown;
};

export function formatTelegramError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Unknown Telegram error";
  }

  const telegramError = error as TelegramLikeError;
  const parts = [
    typeof telegramError.code === "string" ? telegramError.code : null,
    typeof telegramError.response?.statusCode === "number" ? `HTTP ${telegramError.response.statusCode}` : null,
    typeof telegramError.message === "string" ? redactTelegramToken(telegramError.message) : null
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "Telegram request failed";
}

function redactTelegramToken(value: string): string {
  return value.replace(/bot\d+:[A-Za-z0-9_-]+/g, "bot<redacted>");
}
