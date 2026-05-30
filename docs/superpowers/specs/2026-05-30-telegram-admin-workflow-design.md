# Telegram Admin Workflow Design

## Goal

Improve the Telegram admin bot so the owner can process new cleaning leads quickly and avoid losing requests that need a callback.

## Scope

This iteration adds a guided owner workflow:

`New lead -> Call result -> Price -> Visit date -> Visit time -> Scheduled -> Closed or rejected`

The first version is designed for one owner. The data model should leave room for an assigned worker field later, but worker management, analytics, calendar views, and a full action history are outside this iteration.

## Lead Data

Extend each lead with:

- `call_result`: `reached`, `unreached`, or empty before the first call.
- `price_amount`: the agreed integer price in UAH or empty until entered.
- `scheduled_at`: the visit date and time in ISO format or empty until scheduled.
- `reminder_type`: the currently pending reminder type or empty.
- `reminder_at`: the next reminder time in ISO format or empty.
- `new_lead_reminder_count`: how many unattended-new-lead reminders have already been sent.

The schema should remain easy to extend with an optional assigned worker later.

## New Lead Card

When a request arrives, send a compact Telegram card containing:

- lead number;
- service;
- location;
- phone;
- optional comment;
- creation time;
- current status.

Send uploaded photos as separate messages after the card, as the current bot does.

Initially show only:

- `📞 Дозвонился`
- `☎️ Не дозвонился`

## Reached Customer Flow

When the owner presses `📞 Дозвонился`:

1. Save `call_result = reached`.
2. Clear any pending reminder.
3. Ask the owner to enter the agreed integer price as a message, for example `1800`.
4. After a valid price, save it and show:
   - `Сегодня`
   - `Завтра`
   - `Другая дата`
5. For `Другая дата`, ask for a date in `DD.MM` format.
6. Ask for a visit time in `HH:MM` format.
7. Save the combined date and time as `scheduled_at`, update the lead status to `scheduled`, and refresh the lead card.

For `Сегодня` and `Завтра`, resolve the selected date using the server's configured local timezone. For `Другая дата`, use the current year unless the selected day and month have already passed, in which case use the next year.

While the owner is entering a price, date, or time, associate the reply with the active lead through an in-memory owner conversation state. Since the first iteration supports one owner, only one active input flow is required. Starting a new guided action replaces the previous unfinished flow and tells the owner which lead is now active.

## Unreached Customer Flow

When the owner presses `☎️ Не дозвонился`:

1. Save `call_result = unreached`.
2. Update the lead status to `unreached`.
3. Schedule a callback reminder one hour later.
4. Refresh the lead card with a `📞 Позвонить повторно` button.

Pressing `📞 Позвонить повторно` restores the two call-result buttons so the owner can record the next outcome.

## Scheduled Lead Flow

After a visit is scheduled, show:

- `✅ Выполнено`
- `❌ Отказ`

`✅ Выполнено` changes the status to `closed`.

`❌ Отказ` changes the status to `rejected`.

Both actions clear pending reminders and refresh the lead card.

## Lead Lists

The `/leads` command opens a section menu:

- `🆕 Новые`
- `☎️ Не дозвонились`
- `📅 Назначенные`
- `✅ Выполненные`
- `❌ Отказы`

Each section displays the 10 most recent leads with their number, location, phone, and current status. If a section is empty, show a short empty-state message. The owner can return to the section menu from every list.

## Reminders

Use an application-level timer that periodically asks the database for due reminders. Reminder state must live in SQLite so it survives a server restart.

For a lead still in `new` status:

1. Schedule the first unattended reminder 10 minutes after creation.
2. When it is sent, schedule the second reminder 30 minutes later.
3. When the second reminder is sent, clear the reminder. Do not send more unattended reminders.

For a lead marked `unreached`:

1. Schedule one callback reminder one hour after the button press.
2. When it is sent, clear the reminder. Do not repeat it automatically.

Each reminder is a separate Telegram message containing the lead number, reason for the reminder, phone, and a button that resumes the appropriate call flow.

## Validation And Errors

- Accept a price only when it is a positive integer.
- Accept a custom date only in `DD.MM` format and only when it forms a real calendar date.
- Accept a time only in `HH:MM` 24-hour format.
- Invalid input does not modify the saved lead. The bot explains the expected format and waits for a corrected message.
- Only the configured owner chat can use admin commands, callbacks, and guided text input.
- An unknown or stale callback returns a short Telegram callback error without changing a lead.

## Testing

Add automated tests for:

- valid guided transitions from a new lead to a scheduled visit;
- invalid price, date, and time input without lead mutation;
- `unreached` state and one-hour callback reminder;
- first and second unattended-new-lead reminders;
- no extra unattended reminder after the second message;
- status-filtered lead lists;
- closing and rejecting a scheduled lead;
- rejecting admin commands, callbacks, and guided text input from unauthorized chats.

