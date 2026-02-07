# OnCourt Case Tracking Dashboard

A standalone frontend dashboard for tracking court cases through all legal stages - from case filing to warrant execution.

## Features

- 🔍 **Search** - Search by case number, petitioner, or respondent
- 📊 **Stage Filter** - Filter by 7 stages + Withdrawn
- 📅 **Date Range** - Filter by filing date
- 🃏 **Status Cards** - Visual cards with delivery attempt indicators
- 📱 **Detail Modal** - Full case timeline view
- 🚫 **Withdrawn Cases** - Special styling with reason display

## Stage Progression

```
📝 Case Filed → 📄 Summons Issued → 📧 Digital Service → 📮 Postal Service → 🚓 Police Service → ⚖️ Bailable Warrant → 🚨 Non-Bailable Warrant
```

## Tech Stack

- HTML5
- CSS3 (Custom Design System)
- Vanilla JavaScript

## Local Development

```bash
npx http-server -p 3000
```

Open http://localhost:3000

## License

MIT
